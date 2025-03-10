import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verify-jwt";
import create from "./create";
import fetch from "./fetch";
import nearby from "./nearby";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance){
    app.addHook('onRequest', verifyJwt)

    app.post('/gyms', {
        onRequest: [verifyUserRole('ADMIN')]
    }, create)
    app.get('/gyms/search', fetch)
    app.get('/gyms/nearby', nearby)
}