import { app } from "@/app"
import request from "supertest"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "@/use-cases/register"

interface CreateAndAuthenticateUserResponse {
    token: string
}

export default async function createAndAuthenticateUser(): Promise <CreateAndAuthenticateUserResponse> {

    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.handler({
        name: 'John Doe',
        email: 'email@email.com',
        password: '123456'
    })

    const { body } = await request(app.server).post('/session').send({
        email: 'email@email.com',
        password: '123456'
    })

    return {
        token: body.token
    }
}