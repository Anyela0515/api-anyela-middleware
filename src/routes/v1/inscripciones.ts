import { Request, Response, Router } from 'express'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  const { estudianteId, materias, periodoId } = req.body ?? {}

  if (!estudianteId || !materias?.length || !periodoId) {
    console.error('Faltan campos requeridos')

    return res.status(400).json({
      error: 'Campos requeridos: estudianteId, materias, periodoId'
    })
  }

  return res.status(201).json({
    version: 'v1',
    message: {
      estudianteId,
      materias,
      periodoId
    }
  })
})

export default router