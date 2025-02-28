import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/erros/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodyParamsSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const { email, password } = authenticateBodyParamsSchema.parse(request.body)

    console.log(email, password)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.handler({
            email, password
        })

        const token = await reply.jwtSign({
            role: user.role
        }, {
            sign: {
                sub: user.id
            }
        })

        const refreshToken = await reply.jwtSign({
            role: user.role
        }, {
            sign: {
                sub: user.id,
                expiresIn: '7d'
            }
        })

        reply
            .setCookie(
                'refreshToken', refreshToken, {
                    path: '/',
                    secure: true,
                    sameSite: true,
                    httpOnly: true
                }
            )
            .status(200)
            .send({
                token
            })
    } catch (error) {
        if(error instanceof InvalidCredentialsError){
            reply.status(401).send({message: error.message})
        }
    }

}