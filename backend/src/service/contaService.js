import * as db from '../repository/contaRepository.js';
import { generateToken } from '../utils/jwt.js';


export async function saveConta(conta) {
  let contaAtual = await db.getContaByEmail(conta.email);
  if (contaAtual != null) {
    throw new Error('Conta já existe.');
  }

  return db.saveConta(conta);
}


export async function login(email, senha) {
  let conta = await db.login(email, senha);
  if (conta == null) {
    throw new Error('Email ou senha inválidos.');
  }

  let token = generateToken(conta);
  return token;
}
