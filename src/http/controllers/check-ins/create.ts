import { MaxNumberOfCheckInsError } from "@/use-cases/erros/max-number-of-check-ins-error";
import { ResourceNotFound } from "@/use-cases/erros/resource-not-found";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function create(request: FastifyRequest, reply: FastifyReply) {
    
    const createCheckInsParamsSchema = z.object({
        gymId: z.string().uuid()
    })
    
    const createCheckInBodySchema = z.object({
        latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
        longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
    })
    
    const { gymId } = createCheckInsParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    try {
        const checkInUseCase = makeCheckInUseCase()

        const { checkIn } = await checkInUseCase.handler({
            gymId,
            userId: request.user.sub,
            latitude,
            longitude
        })

        reply.status(201).send({
            checkIn
        })
    } catch (error) {
        
        if(error instanceof ResourceNotFound || error instanceof MaxNumberOfCheckInsError){
            reply.send({
                message: error.message
            })
        }

    }
}