import fastifyJwt from '@fastify/jwt'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../infra/prisma/database'

export async function loginRoute(server: FastifyInstance) {
  server.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const userBodySchema = z.object({
      username: z.string(),
      password: z.string(),
      mode: z.string().optional(),
    })

    try {
      const { username, password, mode } = userBodySchema.parse(req.body)

      // let userToLogin

      // if (mode) {
      //   userToLogin = await prisma.testUser.findFirst({
      //     where: { username, password },
      //     include: {
      //       groups: true,
      //     },
      //   })
      // } else {
      const userToLogin = await prisma.user.findFirst({
        where: { username, password },
        include: {
          groups: true,
        },
      })
      console.log(userToLogin?.groups[0].groupId)
      // }
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
      const expiresIn = mode ? 30 : '30 days'

      const token = server.jwt.sign(
        { id, username, levelOfAccess },
        { sub: id, expiresIn },
      )

      // Set cookie with appropriate settings
      reply.setCookie('auth', token, {
        maxAge: mode ? 30 : 3000,
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
