
import { GymsRepository } from "@/repositories/gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: GymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
    })

    it('should return to near gyms', async () => {

        gymsRepository.create({
            title: 'Gym TypeScript',
            latitude: -21.2006301,
            longitude: -50.4661626
        })

        gymsRepository.create({
            title: 'Gym JavaScript',
            latitude: -21.2888122,
            longitude: -50.3144627
        })

        const { gyms } = await fetchNearbyGymsUseCase.handler({
            userLatitude: -21.2039676,
            userLongitude: -50.4719378
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Gym TypeScript'})
        ])

    })
})