import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { addRoutes } from './routes.js'
import { uploadsDir } from './utils/upload.js'
import { limparLocaisExpirados } from './utils/limpezaLocaisMapa.js'

const api = express()

api.use(cors({
    origin(origin, callback) {
        if (!origin) {
            callback(null, true)
            return
        }

        try {
            const url = new URL(origin)
            const localHost = ['localhost', '127.0.0.1'].includes(url.hostname)
            callback(localHost ? null : new Error('Origem não permitida.'), localHost)
        } catch {
            callback(new Error('Origem inválida.'))
        }
    }
}))

api.use(express.json())
api.use('/uploads', express.static(uploadsDir))

addRoutes(api)

const intervaloLimpezaLocais = setInterval(() => {
    limparLocaisExpirados().catch((error) => {
        console.error('Erro ao limpar locais expirados do mapa:', error)
    })
}, 60 * 1000)
intervaloLimpezaLocais.unref()

limparLocaisExpirados().catch((error) => {
    console.error('Erro ao limpar locais expirados do mapa:', error)
})

const PORT = Number(process.env.PORT) || 5050

api.listen(PORT, () => {
    console.log(`API subiu na porta ${PORT}`)
})