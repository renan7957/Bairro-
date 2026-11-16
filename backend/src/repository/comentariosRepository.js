import { con } from './connection.js';

// Adicionar comentário
export async function salvarComentario(idConta, idPostagem, conteudo) {
    const comando = `
        insert into comentario (id_conta, id_postagem, conteudo)
        values (?, ?, ?)
    `;

    const [resultado] = await con.query(comando, [
        idConta,
        idPostagem,
        conteudo
    ]);

    return resultado.insertId;
}

// Listar comentários de uma publicação
export async function listarComentarios(idPostagem) {
    const comando = `
        select
            comentario.id,
            comentario.conteudo,
            comentario.data_comentario,
            conta.id as id_conta,
            conta.nome
        from comentario
        inner join conta
            on comentario.id_conta = conta.id
        where comentario.id_postagem = ?
        order by comentario.data_comentario asc
    `;

    const [linhas] = await con.query(comando, [idPostagem]);

    return linhas;
}

// Excluir comentário
export async function apagarComentario(idConta, idComentario) {
    const comando = `
        delete from comentario
        where id = ? and id_conta = ?
    `;

    const [resultado] = await con.query(comando, [
        idComentario,
        idConta
    ]);

    return resultado.affectedRows;
}