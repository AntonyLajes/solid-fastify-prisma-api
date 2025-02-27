import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest"
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

describe('Fetch Gyms Controller (e2e)', () => {
    
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to fetch gyms', async () => {
        const createGymUseCase = makeCreateGymUseCase()
        for(let i = 0; i <= 5; i++){
            await createGymUseCase.handler({
                title: `Academia Teste ${i}`,
                description: `Academia teste ${i}`,
                phone: '123456789',
                latitude: 0,
                longitude: 0
            })
        }

        const { token } = await createAndAuthenticateUser()

        const { body, status } = await request(app.server)
            .get('/gyms/search')
            .query({
                query: 'Academia Teste 1'
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(status).toEqual(200)
        expect(body.gyms).toHaveLength(1)
        expect(body.gyms).toEqual([
            expect.objectContaining({
                title: `Academia Teste 1`,
                description: `Academia teste 1`,
            })
        ])
    })
})