import { Coordinate } from "@/utils/get-distance-between-coordinates";
import { Gym, Prisma } from "@prisma/client";

export interface GymsRepository {
    create(data: Prisma.GymCreateInput): Promise<Gym>
    findById(id: string): Promise<Gym | null>
    findManyByQuery(query: string, page: number): Promise<Gym[]>
    findNearby(coordinates: Coordinate): Promise<Gym[]>
}