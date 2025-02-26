import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()
app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})
app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError){
        reply.status(400).send({
            message: 'Invalid Params.',
            error: error.format()
        })
    }

    if(env.NODE_ENV === "dev"){
        console.error(error)
    }

    reply.status(500).send({message: 'Internal Server Error.'})
})