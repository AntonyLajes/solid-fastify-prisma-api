import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: CheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-Ins History Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
    })
    
    it('should be able to fetch check-in history', async () => {
        await checkInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01'
        })

        await checkInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-02'
        })

        const { checkIns } = await sut.handler({
            userId: 'user-01',
            page: 1
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-01'}),
            expect.objectContaining({gym_id: 'gym-02'})
        ])
    })

    it('should be able to paginate check-in history fetch', async () => {
        for (let i = 0; i<=22; i++){
            await checkInsRepository.create({
                user_id: 'user-01',
                gym_id: `gym-${i}`
            })
        }

        const { checkIns } = await sut.handler({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns).toHaveLength(3)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-20'}),
            expect.objectContaining({gym_id: 'gym-21'}),
            expect.objectContaining({gym_id: 'gym-22'})
        ])
    })


})