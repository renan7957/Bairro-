
import * as service from '../service/contaService.js';
import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();

endpoints.post('/conta', async (req, resp) => {
    try {
        const conta = req.body;

        await service.saveConta(conta);

        const token = await service.login(conta.email, conta.senha);

        resp.status(201).send({ token });
    } catch (err) {
        console.error('ERRO AO CADASTRAR:', err);

        resp.status(400).send({
            erro: err.message
        });
    }
});

endpoints.post('/conta/login', async (req, resp) => {
    try {
        const { email, senha } = req.body;

        const token = await service.login(email, senha);

        resp.send({ token });
    } catch (err) {
        resp.status(401).send({
            erro: err.message
        });
    }
});

endpoints.get('/conta', getAuthentication(), async (req, resp) => {
    try {
        const conta = await service.buscarConta(req.user.id);

        resp.send(conta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
    }
});

export default endpoints;
