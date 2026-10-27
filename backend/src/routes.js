import conta from './controller/contaController.js'


export function addRoutes(api) {
    api.use(conta);
}