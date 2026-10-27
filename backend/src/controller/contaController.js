import * as service from '../service/contaService.js';

import { Router } from "express";
const endpoints = Router();



endpoints.post('/conta', async (req, resp) => {
  try {
    let conta = req.body;

    let id = await service.saveConta(conta);
    resp.send({ id });
  }
  catch (err) {
    resp.status(400).send({
      erro: err.message
    })
  }
})




endpoints.post('/conta/login', async (req, resp) => {
  try {
    let email = req.body.email;
    let senha = req.body.senha;

    let token = await service.login(email, senha);
    resp.send({token});
  }
  catch (err) {
    resp.status(401).send({
      erro: err.message
    })
  }
})


export default endpoints;
