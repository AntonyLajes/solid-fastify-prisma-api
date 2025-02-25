import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {

    items: CheckIn[] = []

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn: CheckIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at ? new Date(data.validated_at) : null
        }

        this.items.push(checkIn)

        return checkIn
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

        if(checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn
        }


        return checkIn
    }

    async findByCheckInId(checkInId: string) {
        const checkIn = this.items.find((item) => item.id === checkInId)
    
        if(!checkIn) return null

        return checkIn
    }

    async findManyByUserId(userId: string, page: number) {
        const checkIns = this.items.filter((item) => item.user_id === userId)

        return checkIns.slice((page - 1) * 20, page * 20)
    }

    async findCheckInsMetricsByUserId(userId: string) {
        const checkInsMetrics = this.items.filter((item) => item.user_id === userId).length

        return checkInsMetrics
    }

    async findByUserIdOnDate(userId: string, date: Date){
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            
            return checkIn.user_id === userId && isOnSameDate
        })

        if(!checkInOnSameDate) return null

        return checkInOnSameDate
    }

}