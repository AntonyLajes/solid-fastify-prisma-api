import { GymsRepository } from "@/repositories/gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: GymsRepository
let createGymUseCase: CreateGymUseCase

describe('Creeate Gym Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        createGymUseCase = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {
        const { gym } = await createGymUseCase.handler({
            title: 'Gym Title',
            description: 'Gym Description',
            phone: '012987654321',
            latitude: 0,
            longitude: 0
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})