import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply){

    await request.jwtVerify({
        onlyCookie: true
    })

    const token = await reply.jwtSign(
        {
            role: request.user.role
        },
        {
            sign: {
                sub: request.user.sub
            }
        }
    )

    const refreshToken = await reply.jwtSign(
        {
            role: request.user.role
        },
        {
            sign: {
                sub: request.user.sub,
                expiresIn: '7d'
            }
        }
    )

    reply
        .setCookie(
            'refreshToken', refreshToken, {
                path: '/',
                sameSite: true,
                httpOnly: true,
                secure: true
            }
        )
        .status(200)
        .send({
            token
        })
}