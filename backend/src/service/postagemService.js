
import * as db from '../repository/postagemRepository.js';

function normalizarCategoria(categoria) {
    const valor = String(categoria || '').trim().toLowerCase();

    if (['todos', 'aviso', 'evento', 'duvida', 'ocorrência', 'ocorrencia'].includes(valor)) {
        if (valor === 'ocorrência' || valor === 'ocorrencia') return 'ocorrencia';
        return valor;
    }

    if (['aviso', 'evento', 'duvida', 'ocorrencia'].includes(valor)) {
        return valor;
    }

    return 'aviso';
}

function erroDeValidacao(mensagem) {
    const erro = new Error(mensagem);
    erro.status = 400;
    return erro;
}

// Criar publicação
export async function criarPostagem(idConta, conteudo, categoria, titulo = '', endereco = '', descricao = '', foto = '', dataEvento = '', latitude, longitude) {
    const texto = typeof conteudo === 'string' ? conteudo.trim() : '';
    const tituloFormatado = typeof titulo === 'string' ? titulo.trim() : '';
    const enderecoFormatado = typeof endereco === 'string' ? endereco.trim() : '';
    const descricaoFormatada = typeof descricao === 'string' ? descricao.trim() : '';
    const fotoFormatada = typeof foto === 'string' ? foto.trim() : '';
    const dataEventoFormatada = typeof dataEvento === 'string' ? dataEvento.trim() : '';
    const categoriaNormalizada = normalizarCategoria(categoria);
    const latitudeFormatada = latitude === undefined || latitude === null || latitude === ''
        ? null
        : Number(latitude);
    const longitudeFormatada = longitude === undefined || longitude === null || longitude === ''
        ? null
        : Number(longitude);

    if (!texto && !tituloFormatado && !enderecoFormatado && !descricaoFormatada && !fotoFormatada) {
        throw new Error('A publicação não pode estar vazia.');
    }

    if (dataEventoFormatada && Number.isNaN(new Date(dataEventoFormatada).getTime())) {
        throw new Error('A data do evento é inválida.');
    }

    if ((latitudeFormatada === null) !== (longitudeFormatada === null)) {
        throw erroDeValidacao('Informe latitude e longitude juntas.');
    }

    if (
        latitudeFormatada !== null
        && (!Number.isFinite(latitudeFormatada)
            || latitudeFormatada < -90
            || latitudeFormatada > 90
            || !Number.isFinite(longitudeFormatada)
            || longitudeFormatada < -180
            || longitudeFormatada > 180)
    ) {
        throw erroDeValidacao('As coordenadas do local são inválidas.');
    }

    const conteudoFinal = texto || [tituloFormatado, descricaoFormatada, enderecoFormatado].filter(Boolean).join(' - ');

    return db.savePostagem(
        idConta,
        conteudoFinal,
        categoriaNormalizada,
        tituloFormatado,
        enderecoFormatado,
        descricaoFormatada,
        fotoFormatada,
        dataEventoFormatada,
        latitudeFormatada,
        longitudeFormatada
    );
}

// Listar publicações
export async function listarPostagens(idConta) {
    return db.getPostagens(idConta);
}

export async function removerLocaisExpirados() {
    return db.removerLocaisExpirados();
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

    if (resultado === null) {
        throw new Error('Publicação não encontrada ou você não tem permissão para apagá-la.');
    }

    return resultado.foto;
}