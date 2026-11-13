
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

// Criar publicação
export async function criarPostagem(idConta, conteudo, categoria, titulo = '', endereco = '', descricao = '', foto = '', dataEvento = '') {
    const texto = typeof conteudo === 'string' ? conteudo.trim() : '';
    const tituloFormatado = typeof titulo === 'string' ? titulo.trim() : '';
    const enderecoFormatado = typeof endereco === 'string' ? endereco.trim() : '';
    const descricaoFormatada = typeof descricao === 'string' ? descricao.trim() : '';
    const fotoFormatada = typeof foto === 'string' ? foto.trim() : '';
    const dataEventoFormatada = typeof dataEvento === 'string' ? dataEvento.trim() : '';
    const categoriaNormalizada = normalizarCategoria(categoria);

    if (!texto && !tituloFormatado && !enderecoFormatado && !descricaoFormatada && !fotoFormatada) {
        throw new Error('A publicação não pode estar vazia.');
    }

    if (dataEventoFormatada && Number.isNaN(new Date(dataEventoFormatada).getTime())) {
        throw new Error('A data do evento é inválida.');
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
        dataEventoFormatada
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

    if (resultado === null) {
        throw new Error('Publicação não encontrada ou você não tem permissão para apagá-la.');
    }

    return resultado.foto;
}