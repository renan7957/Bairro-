import conta from './controller/contaController.js';
import postagem from './controller/postagemController.js';
import curtida from './controller/curtidaController.js';

export function addRoutes(api) {
    api.use(conta);
    api.use(postagem);
    api.use(curtida);
}