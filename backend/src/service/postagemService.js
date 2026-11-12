
import * as db from '../repository/postagemRepository.js';

// Criar publicação
// Criar publicação
export async function criarPostagem(idConta, conteudo, categoria) {
    if (!conteudo || !conteudo.trim()) {
        throw new Error('A publicação não pode estar vazia.');
    }

    const categoriasPermitidas = ['todos', 'aviso', 'evento', 'duvida'];

    if (!categoriasPermitidas.includes(categoria)) {
        throw new Error('Categoria inválida.');
    }

    return db.savePostagem(
        idConta,
        conteudo.trim(),
        categoria
    );
}

// Listar publicações
export async function listarPostagens(idConta) {
    return db.getPostagens(idConta);
}

// Curtir publicação
export async function curtirPostagem(idConta, idPostagem) {
    return db.curtirPostagem(idConta, idPostagem);
}

// Descurtir publicação
export async function descurtirPostagem(idConta, idPostagem) {
    return db.descurtirPostagem(idConta, idPostagem);
}

// Apagar publicação
export async function apagarPostagem(idConta, idPostagem) {
    if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
        throw new Error('Publicação inválida.');
    }

    const resultado = await db.apagarPostagem(idConta, idPostagem);

    if (resultado === 0) {
        throw new Error('Publicação não encontrada ou você não tem permissão para apagá-la.');
    }
}