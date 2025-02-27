import { makeFetchGymsUseCase } from "@/use-cases/factories/make-fetch-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { coerce, z } from "zod";

export default async function fetch (request: FastifyRequest, reply: FastifyReply) {

    const fetchGymsQueryParamsSchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    })

    const { query, page } = fetchGymsQueryParamsSchema.parse(request.query)

    const fetchGymsUseCase = makeFetchGymsUseCase()

    const { gyms } = await fetchGymsUseCase.handler({
        query,
        page
    })

    reply.send({
        gyms
    })
} 