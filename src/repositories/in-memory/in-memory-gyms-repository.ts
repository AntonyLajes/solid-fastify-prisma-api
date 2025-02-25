import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/library";

export class InMemoryGymsRepository implements GymsRepository {

    public items: Gym[] = []

    async create( data: Prisma.GymCreateInput) {
        const gym: Gym = {
            id: data.id ?? randomUUID(),
            description: data.description ?? null,
            latitude: new Decimal(Number(data.latitude)),
            longitude: new Decimal(Number(data.longitude)),
            phone: data.phone ?? null,
            title: data.title
        }

        this.items.push(gym)

        return gym
    }

    async findById(id: string){
        const gym = this.items.find((item) => item.id === id)

        if(!gym) return null

        return gym
    }

}