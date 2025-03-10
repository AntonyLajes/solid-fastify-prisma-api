import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {

    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
    findByCheckInId(checkInId: string): Promise<CheckIn | null>
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    findCheckInsMetricsByUserId(userId: string): Promise<number>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}