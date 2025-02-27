import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "@/use-cases/create-gym";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function create(request: FastifyRequest, reply: FastifyReply) {

    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

    const createGymUseCase = makeCreateGymUseCase()

    const { gym } = await createGymUseCase.handler({
        title,
        description,
        phone,
        latitude,
        longitude
    })

    return reply.status(201).send({ gym })


}