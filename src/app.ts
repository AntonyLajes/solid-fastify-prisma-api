import fastify from 'fastify'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

prisma.user.create({
    data: {
        name: 'John Linux',
        email: 'john@email.com'
    }
})

export const app = fastify()