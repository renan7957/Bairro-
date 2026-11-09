import * as db from '../repository/curtidaRepository.js';

export async function curtir(idConta, idPostagem) {
    return db.curtir(idConta, idPostagem);
}

export async function descurtir(idConta, idPostagem) {
    return db.descurtir(idConta, idPostagem);
}

export async function listarCurtidas(idPostagem, idConta) {
    return db.listarCurtidas(idPostagem, idConta);
}