import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../infra/prisma/database'
import { z } from 'zod'
import { auth } from '../../lib/auth'

export async function groupRoutes(server: FastifyInstance) {
  server.get('/groups', { preHandler: [auth] }, async (req) => {
    const querySchema = z.object({
      mode: z.string().optional(),
    })
    const { mode } = querySchema.parse(req.query)
    if (!mode) {
      const groups = await prisma.groups.findMany()
      return groups
    }
    const testGroups = await prisma.testGroups.findMany()
    return testGroups
  })
  server.post(
    '/groups',
    { preHandler: auth },
    async (req: FastifyRequest, res: FastifyReply) => {
      const groupSchema = z.object({
        groupName: z.string(),
        levelOfAccess: z.number(),
        mode: z.string().optional(),
      })

      const { groupName, levelOfAccess, mode } = groupSchema.parse(req.body)

      try {
        if (!mode) {
          await prisma.groups.create({
            data: {
              groupName,
              levelOfAccess,
            },
          })
          res.status(201)
        } else {
          await prisma.testGroups.create({
            data: {
              groupName,
              levelOfAccess,
            },
          })
          res.status(201)
        }
      } catch (error) {
        console.error(error)
        res.status(409)
      }
    },
  )
}
export default groupRoutes
