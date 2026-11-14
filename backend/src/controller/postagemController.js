
import { Router } from 'express';
import { unlink } from 'node:fs/promises';
import * as service from '../service/postagemService.js';
import { getAuthentication } from '../utils/jwt.js';
import { caminhoFoto, uploadFoto } from '../utils/upload.js';
import { limparLocaisExpirados } from '../utils/limpezaLocaisMapa.js';

const endpoints = Router();

// Criar publicação
endpoints.post('/postagem', getAuthentication(), (req, resp, next) => {
    // Garante que existe um objeto antes de qualquer parser tratar o corpo.
    req.body = req.body || {};
    uploadFoto.single('foto')(req, resp, (err) => {
        if (err) {
            const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
            resp.status(status).send({ erro: err.message });
            return;
        }

        // Multipart uploads may leave body unset when the request has no fields.
        req.body = req.body || {};
        next();
    });
}, async (req, resp) => {
    try {
        const {
            conteudo,
            categoria,
            titulo,
            endereco,
            descricao,
            dataEvento,
            latitude,
            longitude
        } = req.body || {};
        const idConta = req.user.id;
        const foto = req.file ? `/uploads/${req.file.filename}` : '';

        const id = await service.criarPostagem(
            idConta,
            conteudo,
            categoria,
            titulo,
            endereco,
            descricao,
            foto,
            dataEvento,
            latitude,
            longitude
        );

        resp.status(201).send({ id });

    } catch (err) {
        if (req.file) {
            await unlink(req.file.path).catch((fileError) => {
                if (fileError.code !== 'ENOENT') console.error('Erro ao remover upload incompleto:', fileError);
            });
        }

        console.error('Erro ao criar publicação:', err);
        resp.status(err.status || 500).send({
            erro: err.status ? err.message : 'Erro ao salvar publicação no banco de dados.'
        });
    }
});

// Listar publicações
endpoints.get('/postagem', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;

        await limparLocaisExpirados();
        const postagens = await service.listarPostagens(idConta);

        resp.send(postagens);

    } catch (err) {
        console.error('Erro ao listar publicações:', err);
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

// Apagar publicação
endpoints.delete('/postagem/:id', getAuthentication(), async (req, resp) => {
    try {
        const idConta = req.user.id;
        const idPostagem = Number(req.params.id);

        const foto = await service.apagarPostagem(idConta, idPostagem);
        const arquivoFoto = caminhoFoto(foto);

        if (arquivoFoto) {
            await unlink(arquivoFoto).catch((err) => {
                if (err.code !== 'ENOENT') console.error('Erro ao remover arquivo da publicação:', err);
            });
        }

        resp.status(200).send({
            mensagem: 'Publicação apagada com sucesso!'
        });

    } catch (err) {
        const status = err.message.includes('não encontrada') ? 404 : 400;

        resp.status(status).send({ erro: err.message });
    }
});

export default endpoints;
