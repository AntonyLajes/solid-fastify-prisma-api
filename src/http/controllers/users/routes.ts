import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance){

    app.post('/users', register)
    app.post('/session', authenticate)

    app.patch('/token/refresh', refresh)
    
    /* Authenticated Routes */
    app.get('/profile', {onRequest: [verifyJwt]}, profile)
}