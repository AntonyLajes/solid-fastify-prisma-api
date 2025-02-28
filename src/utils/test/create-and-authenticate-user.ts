import { app } from "@/app"
import request from "supertest"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "@/use-cases/register"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface CreateAndAuthenticateUserResponse {
    token: string
}

export default async function createAndAuthenticateUser(
    isAdmin: Boolean = false
): Promise <CreateAndAuthenticateUserResponse> {

    await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'email@email.com',
            password_hash: await hash('123456', 6),
            role: isAdmin ? 'ADMIN': 'MEMBER'
        }
    })

    const { body } = await request(app.server).post('/session').send({
        email: 'email@email.com',
        password: '123456'
    })

    return {
        token: body.token
    }
}