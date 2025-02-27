import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import createGym from "@/utils/test/create-gym";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";


describe('Fetch User Check-Ins History Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll( async () => {
        await app.close()
    })

    it('should be able to fetch user check-ins history', async () => {
        const { token } = await createAndAuthenticateUser()
        const { gym } = await createGym()
        const user = await prisma.user.findFirstOrThrow()
    
        const createCheckInUseCase = makeCheckInUseCase()
        await createCheckInUseCase.handler({
            userId: user.id,
            gymId: gym.id,
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber()
        })

        const { statusCode, body } = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(statusCode).toEqual(200)
        expect(body.checkIns).toEqual([
            expect.objectContaining({
                user_id: user.id,
                gym_id: gym.id,
            })
        ])
    })
})