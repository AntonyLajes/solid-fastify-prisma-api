import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest"
import { before } from "node:test";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import createGym from "@/utils/test/create-gym";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { prisma } from "@/lib/prisma";

describe('Fetch Check-Ins Metrics Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to fetch user check-ins metrics', async () => {

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
            .get(`/check-ins/metrics`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(statusCode).toEqual(200)
        expect(body.checkInsMetrics).toEqual(1)

    })
})