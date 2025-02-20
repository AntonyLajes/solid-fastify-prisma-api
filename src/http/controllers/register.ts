import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { EmailAlreadyExistsError } from "./erros/email-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply){
    const requestBodyParamsSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })
    const { name, email, password } = requestBodyParamsSchema.parse(request.body)

    try {
        const prismaUsersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUsersRepository)
        
        await registerUseCase.handler({
            name, email, password
        })
    } catch (error) {
        if(error instanceof EmailAlreadyExistsError){
            return reply.status(409).send({message: error.message})
        }

        throw error
    }

    return reply.status(201).send()
} 