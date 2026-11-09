import { con } from './connection.js';

export async function curtir(idConta, idPostagem) {
    const command = `
        insert ignore into curtida (id_conta, id_postagem)
        values (?, ?)
    `;

    await con.query(command, [idConta, idPostagem]);
}

export async function descurtir(idConta, idPostagem) {
    const command = `
        delete from curtida
        where id_conta = ?
        and id_postagem = ?
    `;

    await con.query(command, [idConta, idPostagem]);
}

export async function listarCurtidas(idPostagem, idConta) {
    const command = `
        select
            count(*) as total,
            coalesce(max(id_conta = ?), 0) as curtiu
        from curtida
        where id_postagem = ?
    `;

    const [linhas] = await con.query(command, [
        idConta,
        idPostagem
    ]);

    return linhas[0];
}