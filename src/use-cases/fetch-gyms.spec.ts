import { GymsRepository } from "@/repositories/gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchGymsUseCase } from "./fetch-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: GymsRepository
let sut: FetchGymsUseCase

describe('Fetch Gyms Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchGymsUseCase(gymsRepository)
    })

    it('should be able to fetch gyms by query', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            latitude: 0,
            longitude: 0,
        })

        await gymsRepository.create({
            title: 'TypeScript Gym',
            latitude: 0,
            longitude: 0,
        })

        const { gyms } = await sut.handler({
            query: 'TypeScript',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'TypeScript Gym'})
        ])
    })

    it('should be able to fetch gyms by query with pagination', async () => {
        for(let i = 0; i < 22; i++){
            await gymsRepository.create({
                title: `TypeScript Gym ${i}`,
                latitude: 0,
                longitude: 0,
            })
        }

        const { gyms } = await sut.handler({
            query: 'TypeScript',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'TypeScript Gym 20'}),
            expect.objectContaining({title: 'TypeScript Gym 21'})
        ])
    })
})