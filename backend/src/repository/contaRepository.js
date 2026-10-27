import { con } from './connection.js';

export async function saveConta(conta) {
    const command = `
        Insert into conta (nome, email, telefone, senha)
                    values (?,?,?, md5(?)) 
        `

    const [result] = await con.query (command, [
        conta.nome,
        conta.email,
        conta.telefone,
        conta.senha,
    ]);

    return result.insertId;
}

export async function getContaByEmail(email) {
  const command = `
    select id,
           nome,
           email
     from conta
    where email = ?
  `

  const [linhas] = await con.query(command, [email])
  return linhas[0];
}


export async function login(email, senha) {
  const command = `
    select id,
           nome,
           email
     from conta
    where email = ?
      and senha = md5(?)
  `

  const [linhas] = await con.query(command, [email, senha])
  return linhas[0];
}
