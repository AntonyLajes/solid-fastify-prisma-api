import { GymsRepository } from "@/repositories/gyms-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ResourceNotFound } from "./erros/resource-not-found";
import { LateCheckInValidationError } from "@/repositories/in-memory/late-check-in-validation-error";

let checkInsRepository: CheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const {checkIn} = await sut.handler({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate check-in after 20 min', async () => {
        vi.setSystemTime(new Date(2025, 1, 25, 18, 0, 0))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs) 

        await expect(sut.handler({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
    

    it('should not be able to validate unexistent check-in', async () => {
        await expect(sut.handler({
            checkInId: 'unexistent id'
        })).rejects.toBeInstanceOf(ResourceNotFound)
    })
})