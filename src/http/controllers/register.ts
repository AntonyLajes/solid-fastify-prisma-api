import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hash } from "bcryptjs";

export async function register(request: FastifyRequest, reply: FastifyReply){
    const requestBodyParamsSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = requestBodyParamsSchema.parse(request.body)

    const password_hash = await hash(password, 6)

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash
        }
    })

    return reply.status(201).send()
} 