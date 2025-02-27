import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "@/use-cases/get-user-profile";
import { RegisterUseCase } from "@/use-cases/register";

describe(('Profile Controller (e2e)'), () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async ()=> {
        await app.close()
    })

    it('should be able to get user profile', async () => {
        const usersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        await registerUseCase.handler({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123456'
        })

        const authentication = await request(app.server).post('/session').send({
            email: 'email@email.com',
            password: '123456'
        })

        const profile = await request(app.server)
            .get('/profile')
            .set('Authorization', `Bearer ${authentication.body.token}`)

        expect(profile.status).toEqual(200)
        expect(profile.body.user).toEqual(expect.objectContaining({
            email: 'email@email.com'
        }))
    })

})