import { makeFetchUserCheckInsMetricsUseCase } from "@/use-cases/factories/make-get-user-check-ins-metrics-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function metrics(request: FastifyRequest, reply: FastifyReply) {

    const fetchUserCheckInsMetricsUseCase = makeFetchUserCheckInsMetricsUseCase()

    const { checkInsMetrics } = await fetchUserCheckInsMetricsUseCase.handler({
        userId: request.user.sub
    })

    reply.send({
        checkInsMetrics
    })

}