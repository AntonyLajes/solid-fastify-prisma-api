import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

describe('Fetch Nearby Gyms Controller', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to fetch nearby gyms', async () => {

        const createGymUseCase = makeCreateGymUseCase()

        await createGymUseCase.handler({
            title: 'Gym TypeScript',
            description: 'Gym TypeScript Description',
            latitude: -21.2006301,
            longitude: -50.4661626,
            phone: '123123123'
        })
        await createGymUseCase.handler({
            title: 'Gym JavaScript',
            description: 'Gym JavaScript Description',
            latitude: -21.2888122,
            longitude: -50.3144627,
            phone: '123123123'
        })

        const { token } = await createAndAuthenticateUser()

        const { status, body } = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -21.2006301,
                longitude: -50.4661626,
            })
            .set('Authorization', `Bearer ${token}`)

        expect(status).toEqual(200)
        expect(body.gyms).toHaveLength(1)
        expect(body.gyms).toEqual([
            expect.objectContaining({
                title: 'Gym TypeScript',
                description: 'Gym TypeScript Description',
                latitude: '-21.2006301',
                longitude: '-50.4661626',
                phone: '123123123'
            })
        ]
        )

    })

})
