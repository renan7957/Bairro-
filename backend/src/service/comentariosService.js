import * as db from '../repository/comentariosRepository.js';

// Adicionar comentário
export async function salvarComentario(idConta, idPostagem, conteudo) {
    if (!conteudo || !conteudo.trim()) {
        throw new Error('O comentário não pode ficar vazio.');
    }

    if (!Number.isInteger(Number(idPostagem)) || Number(idPostagem) <= 0) {
        throw new Error('Publicação inválida.');
    }

    return db.salvarComentario(idConta, idPostagem, conteudo.trim());
}

// Listar comentários
export async function listarComentarios(idPostagem) {
    return db.listarComentarios(idPostagem);
}

// Excluir comentário
export async function apagarComentario(idConta, idComentario) {
    const resultado = await db.apagarComentario(idConta, idComentario);

    if (resultado === 0) {
        throw new Error('Comentário não encontrado ou você não tem permissão para excluí-lo.');
    }

    return resultado;
}