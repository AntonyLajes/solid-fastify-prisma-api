import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { RegisterUseCase } from "@/use-cases/register";


describe('Authenticate Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to authenticate', async () => {
        const usersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        await registerUseCase.handler({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123456'
        })
        
        const response = await request(app.server).post('/session').send({
            email: 'email@email.com',
            password: '123456'
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
    })
})