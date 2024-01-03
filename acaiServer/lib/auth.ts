import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function auth(req: FastifyRequest, res: FastifyReply) {
  const reqSchema = z.object({
    auth: z.string().optional(),
  })
  const { auth } = reqSchema.parse(req.cookies)
  if (!auth) {
    res.status(401).send('Unauthorized')
  }
}
