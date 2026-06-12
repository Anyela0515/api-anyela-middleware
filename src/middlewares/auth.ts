import { type Request, type Response, type NextFunction } from 'express'

const VALID_API_KEY = 'secreto-demo'

export function auth(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.headers['x-api-key']

    if (!apiKey || apiKey !== VALID_API_KEY) {
        res.status(401).json({ code: 401, error: 'API key inválida o ausente' })
        return
    }

    next()
}