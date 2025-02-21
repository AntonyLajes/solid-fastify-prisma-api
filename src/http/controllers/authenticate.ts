import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/erros/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodyParamsSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const { email, password } = authenticateBodyParamsSchema.parse(request.body)

    try {
        const prismaUsersRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

        await authenticateUseCase.handler({
            email, password
        })
    } catch (error) {
        if(error instanceof InvalidCredentialsError){
            reply.status(401).send({message: error.message})
        }
    }

    reply.status(200).send()
}