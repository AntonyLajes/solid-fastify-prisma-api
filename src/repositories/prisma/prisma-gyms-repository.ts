import { Coordinate } from "@/utils/get-distance-between-coordinates";
import { Prisma, Gym } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
    
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({data})
        return gym
    }

    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: { id }
        })

        return gym
    }

    async findManyByQuery(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return gyms
    }

    async findNearby({latitude, longitude}: Coordinate) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * from gyms
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

        return gyms
    }

}