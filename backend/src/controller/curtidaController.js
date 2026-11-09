import { Router } from 'express';
import * as service from '../service/curtidaService.js';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();

// Curtir publicação
endpoints.post('/postagem/:id/curtida', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idPostagem = Number(req.params.id);

        if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
            return resp.status(400).send({ erro: 'Publicação inválida.' });
        }

        await service.curtir(idConta, idPostagem);

        resp.send({ mensagem: 'Publicação curtida!' });

    } catch (err) {
        resp.status(500).send({ erro: 'Erro ao curtir publicação.' });
    }
});

// Descurtir publicação
endpoints.delete('/postagem/:id/curtida', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idPostagem = Number(req.params.id);

        if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
            return resp.status(400).send({ erro: 'Publicação inválida.' });
        }

        await service.descurtir(idConta, idPostagem);

        resp.send({ mensagem: 'Curtida removida!' });

    } catch (err) {
        resp.status(500).send({ erro: 'Erro ao descurtir publicação.' });
    }
});

export default endpoints;