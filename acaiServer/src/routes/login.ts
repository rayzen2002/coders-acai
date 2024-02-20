import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../infra/prisma/database'

export async function loginRoute(server: FastifyInstance) {
  server.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    console.log(req.body)
    const userBodySchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    try {
      const { username, password } = userBodySchema.parse(req.body)

      const userToLogin = await prisma.user.findFirst({
        where: { username, password },
        include: {
          groups: true,
        },
      })

      const groupOfUserToLogin = await prisma.groups.findFirst({
        where: {
          id: userToLogin?.groups[0].groupId,
        },
      })
      console.log(groupOfUserToLogin?.levelOfAccess)
      const levelOfAccess = groupOfUserToLogin?.levelOfAccess
      if (!userToLogin) {
        throw new Error('Invalid Login')
      }
      const id = userToLogin.id
      const expiresIn = '30 days'

      const token = server.jwt.sign(
        { id, username, levelOfAccess },
        { sub: id, expiresIn },
      )

      reply.setCookie('auth', token, {
        maxAge: 3000,
        httpOnly: true,
        domain: 'localhost',
        sameSite: 'none',
        secure: true, // Change to true if running over HTTPS
        path: '/',
      })
    } catch (error) {
      reply.status(401).send({ error: error.message })
    }
  })
}
