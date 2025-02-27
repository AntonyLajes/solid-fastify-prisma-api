import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function history(request: FastifyRequest, reply: FastifyReply) {

    const fetchUserCheckInsHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = fetchUserCheckInsHistoryQuerySchema.parse(request.query)

    const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.handler({
        userId: request.user.sub,
        page
    })

    reply.send({
        checkIns
    })

}