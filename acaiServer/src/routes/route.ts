import { FastifyInstance, FastifyRequest } from 'fastify'
import { prisma } from '../../infra/prisma/database'
import { z } from 'zod'
import { auth } from '../../lib/auth'

export async function userRoute(server: FastifyInstance) {
  server.get('/users', { preHandler: [auth] }, async (req: FastifyRequest) => {
    const querySchema = z.object({
      mode: z.string().optional(),
    })
    const { mode } = querySchema.parse(req.query)
    if (!mode) {
      const usersDb = await prisma.user.findMany({
        include: {
          groups: {
            include: {
              groups: {
                select: {
                  groupName: true,
                  levelOfAccess: true,
                },
              },
            },
          },
        },
      })
      const users = usersDb.map((user) => {
        return {
          id: user.id,
          username: user.username,
          groups: user.groups.map((group) => {
            return {
              groupName: group.groups.groupName,
              levelOfAccess: group.groups.levelOfAccess,
            }
          }),
        }
      })
      return { users }
    }
  })
  server.post(
    '/user',
    { preHandler: auth },
    async (req: FastifyRequest, res) => {
      const bodySchema = z.object({
        password: z.string(),
        mode: z.string().optional(),
        username: z.string(),
        group: z.string().array(),
      })
      const { password, username, group } = bodySchema.parse(req.body)
      const groups = await prisma.groups.findMany({
        where: {
          groupName: {
            in: group,
          },
        },
      })

      console.log(groups)
      console.log(password)
      try {
        if (groups[0].groupName) {
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
          throw new Error()
        }
        res.status(201)
      } catch (error) {
        console.error(error)
        res.status(409).send('Grupo inexistente')
      }
    },
  )
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

    return { user }
  })
}

export default userRoute
