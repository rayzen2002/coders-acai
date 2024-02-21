import chalk from 'chalk'
import { prisma } from '../../infra/prisma/database'
import { faker } from '@faker-js/faker'
const createRandomUsers = () => {
  return {
    name: faker.person.fullName(),
    password: faker.person.zodiacSign(),
    id: faker.string.uuid(),
  }
}

const randomUsers = faker.helpers.multiple(createRandomUsers, {
  count: 15,
})
const createRandomGroups = () => {
  return {
    id: faker.string.uuid(),
    groupName: faker.person.jobTitle(),
    levelOfAccess: faker.number.int({ min: 1, max: 5 }),
  }
}

const randomGroups = faker.helpers.multiple(createRandomGroups, {
  count: 5,
})

const createRandomProduct = () => {
  return {
    id: faker.string.uuid(),
    description: faker.commerce.productDescription(),
    distributorId: faker.company.name(),
    name: faker.commerce.productName(),
    price_in_cents: faker.number.int({ min: 1000, max: 5000 }),
  }
}

const randomProducts = faker.helpers.multiple(createRandomProduct, {
  count: 15,
})

const createRandomDistributor = () => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
  }
}

const randomDistributors = faker.helpers.multiple(createRandomDistributor, {
  count: 5,
})

const createRandomCustomer = () => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
  }
}

const randomCustommers = faker.helpers.multiple(createRandomCustomer, {
  count: 20,
})

const createRandomOrder = () => {
  return {
    customerId: randomCustommers[faker.number.int({ min: 0, max: 18 })].id,
    total_in_cents: 0,
  }
}

const randomOrders = faker.helpers.multiple(createRandomOrder, {
  count: 20,
})
const seedDatabase = async () => {
  await prisma.orderItems.deleteMany()
  await prisma.groupsOfUser.deleteMany()
  await prisma.user.deleteMany()
  await prisma.products.deleteMany()
  await prisma.groups.deleteMany()
  await prisma.orders.deleteMany()
  await prisma.customers.deleteMany()
  await prisma.distributor.deleteMany()

  console.log(chalk.yellow('✔ Database reset'))

  await prisma.groups.createMany({
    data: randomGroups.map((group) => {
      return {
        groupName: group.groupName,
        levelOfAccess: group.levelOfAccess,
        id: group.id,
      }
    }),
  })

  console.log(chalk.yellow('✔ Created Groups'))

  const groups = await prisma.groups.findMany()
  for (let j = 0; j < randomUsers.length; j++) {
    const user = randomUsers[j]
    const group = groups[j]

    if (!group) {
      console.error(`Group not found for user ${user.name}`)
      continue
    }

    await prisma.user.create({
      data: {
        username: user.name,
        password: user.password,
        groups: {
          create: {
            assignedBy: 'admin',
            groups: { connect: { id: group.id } },
          },
        },
      },
    })
  }

  console.log(chalk.yellow('✔ Created Groups'))

  await prisma.distributor.createMany({
    data: randomDistributors.map((distributor) => {
      return {
        name: distributor.name,
        id: distributor.id,
      }
    }),
  })

  console.log(chalk.yellow('✔ Created Distributors'))

  await prisma.products.createMany({
    data: randomProducts.map((product) => {
      return {
        name: product.name,
        description: product.description,
        price_in_cents: product.price_in_cents,
        distributorId:
          randomDistributors[faker.number.int({ min: 0, max: 4 })].id,
      }
    }),
  })
  console.log(chalk.yellow('✔ Created Products'))

  await prisma.customers.createMany({
    data: randomCustommers.map((customer) => {
      return {
        name: customer.name,
        address: customer.address,
        email: customer.email,
        distributorId:
          randomDistributors[faker.number.int({ min: 0, max: 4 })].id,
      }
    }),
  })
  console.log(chalk.yellow('✔ Created Customers'))

  const customers = await prisma.customers.findMany()
  const type = ['Buy', 'Sell']
  await prisma.orders.createMany({
    data: customers.map((customer) => {
      return {
        customerId: customer.id,
        total_in_cents: 0,
        createdAt: faker.date.past({ refDate: new Date() }),
        type: type[faker.number.int({ min: 0, max: 1 })],
      }
    }),
  })

  console.log(chalk.yellow('✔ Created Orders'))

  const orders = await prisma.orders.findMany()
  const products = await prisma.products.findMany()

  for (let j = 0; j < orders.length; j++)
    await prisma.orderItems.create({
      data: {
        orderId: orders[j].id,
        productId: products[Math.floor(Math.random() * 10)].id,
        quantity: Math.floor(Math.random() * 15 + 1),
      },
    })

  console.log(chalk.yellow('✔ Created Order Items'))

  const orderItems = await prisma.orderItems.findMany()
  const productsIds = orderItems.map((orderItem) => {
    return {
      id: orderItem.productId,
    }
  })
  const productsInOrders = []
  for (const productId of productsIds) {
    const product = await prisma.products.findFirst({
      where: {
        id: productId.id,
      },
    })
    if (product) {
      productsInOrders.push(product)
    }
  }

  for (const order of orders) {
    const index = orders.indexOf(order) // Get the index of the current order
    const orderItem = orderItems[index]
    if (orderItem) {
      const product = productsInOrders[index]
      if (product) {
        await prisma.orders.update({
          where: {
            id: order.id,
          },
          data: {
            total_in_cents: product.price_in_cents * orderItem.quantity,
          },
        })
      }
    }
  }
  console.log(chalk.greenBright('Database seeded successfully!'))
  process.exit()
}

seedDatabase()
