import express, { type Request, type Response, type NextFunction } from 'express'
import { logger } from './middlewares/logger.js'
import { auth } from './middlewares/auth.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(logger)
app.use(auth)

app.get('/health', (_req: Request, res: Response): void => {
    res.json({
        code: 200,
        status: 'API saludable',
        timestamp: new Date().toISOString()
    })
})

app.use((_req: Request, res: Response): void => {
    res.status(404).json({ code: 404, error: 'Ruta no encontrada' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err.stack)
    res.status(500).json({ code: 500, error: 'Error del servidor' })
})

app.listen(PORT, (): void => {
    console.log('Servidor iniciado')
})