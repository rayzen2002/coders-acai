import { FastifyInstance, FastifyRequest, FastifyRequest } from 'fastify'
import { prisma } from '../../infra/prisma/database'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { auth } from '../../lib/auth'

export async function userRoute(server: FastifyInstance) {
  server.get('/users', { preHandler: [auth] }, async (req: FastifyRequest) => {
    const querySchema = z.object({
      mode: z.string().optional(),
    })
    const { mode } = querySchema.parse(req.query)
    if (!mode) {
      const users = await prisma.user.findMany()
      return { users }
    }
    // const testUsers = await prisma.testUser.findMany()
    // return { testUsers }
  })
  server.post('/user', { preHandler: auth }, async (req, res) => {
    const bodySchema = z.object({
      password: z.string(),
      mode: z.string().optional(),
      username: z.string(),
      group: z.string().array(),
    })
    const { password, mode, username, group } = bodySchema.parse(req.body)
    const groups = await prisma.groups.findMany({
      where: {
        groupName: {
          in: group,
        },
      },
    })

    // const testGroups = await prisma.testGroups.findMany({
    //   where: {
    //     groupName: {
    //       in: group,
    //     },
    //   },
    // })

    try {
      if (!mode) {
        await prisma.user.create({
          data: {
            username,
            password,
            groups: {
              create: groups.map((group) => ({
                groups: { connect: { id: group.id } },
                assignedAt: new Date(),
                assignedBy: 'admin',
              })),
            },
          },
        })
      } else {
        // await prisma.testUser.create({
        //   data: {
        //     username,
        //     password,
        //     groups: {
        //       create: testGroups.map((group) => ({
        //         groups: { connect: { id: group.id } },
        //         assignedAt: new Date(),
        //         assignedBy: 'admin',
        //       })),
        //     },
        //   },
        // })
      }

      res.status(201)
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
  server.get('/user/:id', { preHandler: auth }, async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(req.params)
    console.log(id)
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    })
    console.log(user)
    return { user }
  })
}
