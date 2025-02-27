import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest"
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import createGym from "@/utils/test/create-gym";

describe('Create Check-In Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a new check-in', async () => {
        const { token } = await createAndAuthenticateUser()
        const { gym } = await createGym()

        const {statusCode} = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -21.2006301,
                longitude: -50.4661626,
            })

        expect(statusCode).toEqual(201)
    })
})