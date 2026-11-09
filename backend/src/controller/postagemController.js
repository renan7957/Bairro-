
import { Router } from 'express';
import * as service from '../service/postagemService.js';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();

// Criar publicação
endpoints.post('/postagem', getAuthentication(), async (req, resp) => {
    try {
        const { conteudo } = req.body;
        const idConta = req.user.id;

        const id = await service.criarPostagem(idConta, conteudo);

        resp.status(201).send({ id });

    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

// Listar publicações
endpoints.get('/postagem', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;

        const postagens = await service.listarPostagens(idConta);

        resp.send(postagens);

    } catch (err) {
        resp.status(500).send({ erro: 'Erro ao buscar publicações.' });
    }
});

// Curtir publicação
endpoints.post('/postagem/:id/curtida', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idPostagem = Number(req.params.id);

        await service.curtirPostagem(idConta, idPostagem);

        resp.status(200).send({ mensagem: 'Publicação curtida!' });

    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

// Descurtir publicação
endpoints.delete('/postagem/:id/curtida', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idPostagem = Number(req.params.id);

        await service.descurtirPostagem(idConta, idPostagem);

        resp.status(200).send({ mensagem: 'Curtida removida!' });

    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

export default endpoints;
