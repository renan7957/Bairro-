import { unlink } from 'node:fs/promises';
import * as service from '../service/postagemService.js';
import { caminhoFoto } from './upload.js';

let limpezaEmAndamento;

export function limparLocaisExpirados() {
    if (limpezaEmAndamento) return limpezaEmAndamento;

    limpezaEmAndamento = executarLimpeza().finally(() => {
        limpezaEmAndamento = null;
    });

    return limpezaEmAndamento;
}

async function executarLimpeza() {
    const fotos = await service.removerLocaisExpirados();

    for (const foto of fotos) {
        const arquivo = caminhoFoto(foto);
        if (!arquivo) continue;

        await unlink(arquivo).catch((erro) => {
            if (erro.code !== 'ENOENT') {
                console.error('Erro ao remover foto de local expirado:', erro);
            }
        });
    }
}
