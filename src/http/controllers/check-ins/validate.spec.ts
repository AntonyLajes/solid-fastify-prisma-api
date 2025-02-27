import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest"
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import createGym from "@/utils/test/create-gym";
import { prisma } from "@/lib/prisma";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

describe('Validate User Check-In Controller (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate an user check-in whitin 20 min', async () => {
        const { token } = await createAndAuthenticateUser()
        const { gym } = await createGym()
        const user = await prisma.user.findFirstOrThrow()

        const createCheckInUseCase = makeCheckInUseCase()
        let {checkIn} = await createCheckInUseCase.handler({
            userId: user.id,
            gymId: gym.id,
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber()
        }) 

        const { statusCode } = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(statusCode).toEqual(204)
    })

})

