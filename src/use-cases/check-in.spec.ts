import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { randomUUID } from "node:crypto";
import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error";
import { MaxDistanceError } from "./erros/max-distance-error";

let checkInsRepository: CheckInsRepository
let checkInUseCase: CheckInUseCase
let gymsRepository: GymsRepository
let userId: `${string}-${string}-${string}-${string}-${string}`
let gymId: `${string}-${string}-${string}-${string}-${string}`

describe('Check In Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)
        userId = randomUUID()
        gymId = randomUUID()

        gymsRepository.create({
            id: gymId,
            latitude: 0,
            longitude: 0,
            title: 'Titulo Academia',
            description: 'Desc Academia',
            phone: '011987654321',
        })
        
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })
    
    it('should be able to check in', async () => {
        const { checkIn } = await checkInUseCase.handler({
            userId,
            gymId,
            latitude: 0,
            longitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2025, 1, 24, 10, 0, 0))

        await checkInUseCase.handler({
            userId,
            gymId,
            latitude: 0,
            longitude: 0
        })

        await expect(checkInUseCase.handler({
            userId,
            gymId,
            latitude: 0,
            longitude: 0
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in in different days', async () => {
        vi.setSystemTime(new Date(2025, 1, 25, 18, 0, 0))

        await checkInUseCase.handler({
            userId,
            gymId,
            latitude: 0,
            longitude: 0
        })

        vi.setSystemTime(new Date(2025, 1, 26, 18, 0, 0))

        const { checkIn } = await checkInUseCase.handler({
            userId,
            gymId,
            latitude: 0,
            longitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))
        
    })

    it('should not be able to check in in distant gyms', async () => {
        const newGymId = randomUUID()
        
        gymsRepository.create({
            id: newGymId,
            latitude: -50.4603315,
            longitude: -21.1855787,
            title: 'Titulo Academia 2',
            description: 'Desc Academia 2',
            phone: '011987654321',
        })

        await expect(
            checkInUseCase.handler({
                gymId: newGymId,
                userId: randomUUID(),
                latitude: -21.2099275,
                longitude: -50.3942817
            })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})