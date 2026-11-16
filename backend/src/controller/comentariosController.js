import { Router } from 'express';
import * as service from '../service/comentariosService.js';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();

// Adicionar comentário
endpoints.post('/postagem/:id/comentario', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idPostagem = Number(req.params.id);
        const { conteudo } = req.body;

        const id = await service.salvarComentario(
            idConta,
            idPostagem,
            conteudo
        );

        resp.status(201).send({ id });

    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

// Listar comentários de uma publicação
endpoints.get('/postagem/:id/comentarios', getAuthentication(), async (req, resp) => {
    try {
        const idPostagem = Number(req.params.id);

        const comentarios = await service.listarComentarios(idPostagem);

        resp.send(comentarios);

    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

// Excluir comentário
endpoints.delete('/comentario/:id', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idComentario = Number(req.params.id);

        await service.apagarComentario(idConta, idComentario);

        resp.status(204).send();

    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

export default endpoints;