
import * as db from '../repository/postagemRepository.js';

// Criar publicação
export async function criarPostagem(idConta, conteudo) {
    if (!conteudo || !conteudo.trim()) {
        throw new Error('A publicação não pode estar vazia.');
    }

    return db.savePostagem(idConta, conteudo.trim());
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
