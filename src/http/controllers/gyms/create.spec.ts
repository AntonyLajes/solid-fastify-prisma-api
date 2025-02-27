import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest"
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe('Create Gym Controller (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser()

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Academia Teste',
                description: 'Academia teste',
                phone: '123456789',
                latitude: 0,
                longitude: 0
            })

        expect(response.status).toEqual(201)
        expect(response.body.gym).toEqual(
            expect.objectContaining({
                title: 'Academia Teste',
                description: 'Academia teste',
                phone: '123456789',
                latitude: "0",
                longitude: "0"
            })
        )
    })

})