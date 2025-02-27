import { ResourceNotFound } from "@/use-cases/erros/resource-not-found";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function validate(request: FastifyRequest, reply: FastifyReply) {
    
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid()
    })

    const { checkInId } = validateCheckInParamsSchema.parse(request.params)

    try {
        const validateCheckInUseCase = makeValidateCheckInUseCase()
    
        const { checkIn } = await validateCheckInUseCase.handler({
            checkInId
        })
    
        reply.status(204).send()
    } catch (error) {
        if(error instanceof ResourceNotFound){
            reply.send({
                message: error.message
            })
        }
    }
}