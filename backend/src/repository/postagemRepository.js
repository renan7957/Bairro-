
import { con } from './connection.js';

// Salvar publicação
export async function savePostagem(idConta, conteudo) {
    const command = `
        insert into postagem (id_conta, conteudo)
        values (?, ?)
    `;

    const [result] = await con.query(command, [idConta, conteudo]);

    return result.insertId;
}

// Buscar publicações e informações das curtidas
export async function getPostagens(idConta) {
    const command = `
        select
            p.id,
            p.conteudo,
            p.data_postagem,
            c.id as id_conta,
            c.nome,

            (
                select count(*)
                from curtida l
                where l.id_postagem = p.id
            ) as total_curtidas,

            (
                select count(*)
                from curtida l
                where l.id_postagem = p.id
                and l.id_conta = ?
            ) as curtiu

        from postagem p

        inner join conta c
            on p.id_conta = c.id

        order by p.data_postagem desc
    `;

    const [linhas] = await con.query(command, [idConta]);

    return linhas;
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
