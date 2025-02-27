import { makeFetchNearbyGymUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function nearby (request: FastifyRequest, reply: FastifyReply) {

    const fetchNearbyGymsBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude } = fetchNearbyGymsBodySchema.parse(request.body)

    const fetchNearbyGymsUseCase = makeFetchNearbyGymUseCase()

    const { gyms } = await fetchNearbyGymsUseCase.handler({
        userLatitude: latitude,
        userLongitude: longitude
    })

    reply.send({
        gyms
    })

}