
import { con } from './connection.js';

async function getColunasPostagem() {
    const [colunas] = await con.query('show columns from postagem');
    return new Set(colunas.map((coluna) => coluna.Field));
}

// Salvar publicação
export async function savePostagem(idConta, conteudo, categoria, titulo = '', endereco = '', descricao = '', foto = '', dataEvento = '', latitude = null, longitude = null) {
    const colunas = await getColunasPostagem();
    const campos = ['id_conta'];
    const valores = [idConta];
    if (colunas.has('categoria')) {
        campos.push('categoria');
        valores.push(categoria);
    }
    const temCamposDetalhados = ['titulo', 'endereco', 'descricao', 'foto']
        .some((campo) => colunas.has(campo));
    const precisaSerializar = !temCamposDetalhados
        || (!colunas.has('categoria') && Boolean(categoria))
        || (dataEvento && !colunas.has('data_evento'))
        || (latitude !== null && (!colunas.has('latitude') || !colunas.has('longitude')));
    const conteudoArmazenado = precisaSerializar
        ? JSON.stringify({
            conteudo,
            categoria,
            titulo,
            endereco,
            descricao: descricao || conteudo,
            foto,
            data_evento: dataEvento,
            latitude,
            longitude
        })
        : conteudo;

    if (colunas.has('titulo')) {
        campos.push('titulo');
        valores.push(titulo || null);
    }

    if (colunas.has('endereco')) {
        campos.push('endereco');
        valores.push(endereco || null);
    }

    if (colunas.has('descricao')) {
        campos.push('descricao');
        valores.push(descricao || null);
    }

    if (colunas.has('foto')) {
        campos.push('foto');
        valores.push(foto || null);
    }

    if (colunas.has('data_evento')) {
        campos.push('data_evento');
        valores.push(dataEvento ? `${dataEvento.replace('T', ' ')}:00` : null);
    }

    if (latitude !== null && colunas.has('latitude')) {
        campos.push('latitude');
        valores.push(latitude);
    }

    if (longitude !== null && colunas.has('longitude')) {
        campos.push('longitude');
        valores.push(longitude);
    }

    if (colunas.has('conteudo')) {
        campos.push('conteudo');
        valores.push(conteudoArmazenado);
    }

    const command = `
        insert into postagem (${campos.join(', ')})
        values (${campos.map(() => '?').join(', ')})
    `;

    const [result] = await con.query(command, valores);

    return result.insertId;
}

// Buscar publicações e informações das curtidas
export async function getPostagens(idConta) {
    const colunas = await getColunasPostagem();
    const campos = [
        'p.id',
        'p.conteudo',
        'p.data_postagem',
        'c.id as id_conta',
        'c.nome',
        '(p.id_conta = ?) as minha',
        '(select count(*) from curtida l where l.id_postagem = p.id) as total_curtidas',
        '(select count(*) from curtida l where l.id_postagem = p.id and l.id_conta = ?) as curtiu'
    ];

    campos.push(colunas.has('categoria') ? 'p.categoria' : "'' as categoria");

    if (colunas.has('titulo')) campos.push('p.titulo');
    if (colunas.has('endereco')) campos.push('p.endereco');
    if (colunas.has('descricao')) campos.push('p.descricao');
    if (colunas.has('foto')) campos.push('p.foto');
    if (colunas.has('data_evento')) campos.push('p.data_evento');
    if (colunas.has('latitude')) campos.push('p.latitude');
    if (colunas.has('longitude')) campos.push('p.longitude');

    const command = `
        select
            ${campos.join(', ')}

        from postagem p

        inner join conta c
            on p.id_conta = c.id

        order by p.data_postagem desc
    `;

    const [linhas] = await con.query(command, [
        idConta,
        idConta
    ]);

    return linhas.map((linha) => {
        const publicacao = { ...linha };

        if (publicacao.conteudo && typeof publicacao.conteudo === 'string') {
            try {
                const json = JSON.parse(publicacao.conteudo);
                if (json && typeof json === 'object') {
                    publicacao.titulo = publicacao.titulo || json.titulo || '';
                    publicacao.endereco = publicacao.endereco || json.endereco || '';
                    publicacao.descricao = publicacao.descricao || json.descricao || '';
                    publicacao.foto = publicacao.foto || json.foto || '';
                    publicacao.data_evento = publicacao.data_evento || json.data_evento || null;
                    publicacao.latitude = publicacao.latitude ?? json.latitude ?? null;
                    publicacao.longitude = publicacao.longitude ?? json.longitude ?? null;
                    publicacao.categoria = publicacao.categoria || json.categoria || '';
                    publicacao.conteudo = json.conteudo || publicacao.descricao || json.descricao || json.titulo || publicacao.conteudo;
                }
            } catch (error) {
                publicacao.titulo = publicacao.titulo || '';
                publicacao.endereco = publicacao.endereco || '';
                publicacao.descricao = publicacao.descricao || publicacao.conteudo;
            }
        }

        publicacao.descricao = publicacao.descricao || publicacao.conteudo || '';
        publicacao.titulo = publicacao.titulo || '';
        publicacao.endereco = publicacao.endereco || '';
        publicacao.foto = publicacao.foto || '';
        publicacao.latitude = publicacao.latitude ?? null;
        publicacao.longitude = publicacao.longitude ?? null;

        return publicacao;
    });
}

export async function removerLocaisExpirados() {
    const colunas = await getColunasPostagem();
    const temCoordenadasEmColunas = colunas.has('latitude') && colunas.has('longitude');
    const campos = ['id', 'conteudo'];

    if (colunas.has('foto')) campos.push('foto');
    if (temCoordenadasEmColunas) campos.push('latitude', 'longitude');

    const condicaoLocalizacao = temCoordenadasEmColunas
        ? 'latitude is not null and longitude is not null'
        : `conteudo like '%"latitude"%' and conteudo like '%"longitude"%'`;
    const [linhas] = await con.query(`
        select ${campos.join(', ')}
        from postagem
        where data_postagem <= date_sub(now(), interval 24 hour)
        and ${condicaoLocalizacao}
    `);

    const locaisExpirados = linhas.filter((linha) => {
        let dados = {};
        if (!temCoordenadasEmColunas) {
            try {
                dados = JSON.parse(linha.conteudo);
            } catch {
                return false;
            }
        }

        const latitude = linha.latitude ?? dados.latitude;
        const longitude = linha.longitude ?? dados.longitude;

        return latitude !== null
            && latitude !== undefined
            && longitude !== null
            && longitude !== undefined
            && Number.isFinite(Number(latitude))
            && Number(latitude) >= -90
            && Number(latitude) <= 90
            && Number.isFinite(Number(longitude))
            && Number(longitude) >= -180
            && Number(longitude) <= 180;
    });

    if (locaisExpirados.length === 0) return [];

    const ids = locaisExpirados.map((local) => local.id);
    const [resultado] = await con.query(`
        delete from postagem
        where id in (${ids.map(() => '?').join(', ')})
        and data_postagem <= date_sub(now(), interval 24 hour)
    `, ids);

    if (resultado.affectedRows === 0) return [];

    return locaisExpirados.map((local) => {
        let dados = {};
        try {
            dados = JSON.parse(local.conteudo);
        } catch {
            return null;
        }

        return (colunas.has('foto') && local.foto) || dados.foto;
    }).filter(Boolean);
}

// Curtir publicação
export async function curtirPostagem(idConta, idPostagem) {
    const command = `
        insert ignore into curtida (id_conta, id_postagem)
        values (?, ?)
    `;

    await con.query(command, [idConta, idPostagem]);
}

// Descurtir publicação
export async function descurtirPostagem(idConta, idPostagem) {
    const command = `
        delete from curtida
        where id_conta = ?
        and id_postagem = ?
    `;

    await con.query(command, [idConta, idPostagem]);
}

// Apagar publicação
export async function apagarPostagem(idConta, idPostagem) {
    const colunas = await getColunasPostagem();
    const campoFoto = colunas.has('foto') ? 'foto' : 'conteudo';
    const [postagens] = await con.query(
        `select ${campoFoto} from postagem where id = ? and id_conta = ?`,
        [idPostagem, idConta]
    );

    if (postagens.length === 0) return null;

    let foto = colunas.has('foto') ? postagens[0].foto : null;

    if (!foto && postagens[0].conteudo) {
        try {
            foto = JSON.parse(postagens[0].conteudo).foto || null;
        } catch {
            foto = null;
        }
    }

    const command = `
        delete from postagem
        where id = ?
        and id_conta = ?
    `;

    const [result] = await con.query(command, [
        idPostagem,
        idConta
    ]);

    return result.affectedRows === 0 ? null : { foto };
}
