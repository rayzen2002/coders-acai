import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function deleteUser(server: FastifyInstance) {
  server.delete('/user/:id', { preHandler: [auth] }, async (req, res) => {
    const userParamsSchema = z.object({
      id: z.string(),
    })
    const { id } = userParamsSchema.parse(req.params)
    try {
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
        include: {
          groups: true,
        },
      })
      if (user) {
        await prisma.groupsOfUser.delete({
          where: {
            userId_groupId: {
              userId: id,
              groupId: user.groups[0].groupId,
            },
          },
        })
        await prisma.user.delete({
          where: {
            id,
          },
        })
      }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
export default deleteUser
