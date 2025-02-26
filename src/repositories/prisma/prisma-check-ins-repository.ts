import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
    
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({ data})

        return checkIn
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: { id: data.id},
            data
        })

        return checkIn
    }
    async findByCheckInId(checkInId: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: { id: checkInId}
        })

        return checkIn
    }
    
    async findManyByUserId(userId: string, page: number) {
        const checkIns = await prisma.checkIn.findMany({
            where: { user_id: userId},
            take: 20,
            skip: (page - 1) * 20
        })

        return checkIns
    }

    async findCheckInsMetricsByUserId(userId: string) {
        const count = await prisma.checkIn.count({
            where: {user_id: userId}
        })

        return count
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startDate = dayjs(date).startOf("day").toDate()
        const endDate = dayjs(date).endOf("day").toDate()

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        return checkIn
    }

}