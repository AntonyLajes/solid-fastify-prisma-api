import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserCheckInsMetricserUseCase } from "./get-user-check-ins-metrics";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: CheckInsRepository
let sut: GetUserCheckInsMetricserUseCase

describe('Get User Check Ins Metrics Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserCheckInsMetricserUseCase(checkInsRepository)
    })
    
    it('should return check ins metrics by user id', async () => {
        for(let i = 0; i < 5; i++){
            await checkInsRepository.create({
                user_id: 'user-01',
                gym_id: `gym-${i}`
            })
        }

        const { checkInsMetrics } = await sut.handler({userId: 'user-01'})

        expect(checkInsMetrics).toEqual(5)
    })
})