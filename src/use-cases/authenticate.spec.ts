import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";
import { UsersRepository } from "@/repositories/users-repository";

let usersRepository: UsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)

    })

    it('should be able to authenticate', async () => {
        usersRepository.create({
            name: 'John Doe',
            email: 'john@email.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.handler({
            email: 'john@email.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate when email not exists', async () => {
        await expect(
            sut.handler({
                email: 'john@email.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should be not able to authenticate with a wrong password', async () => {
        usersRepository.create({
            name: 'John Doe',
            email: 'john@email.com',
            password_hash: await hash('123456', 6)
        })

        await expect(
            sut.handler({
                email: 'john@email.com',
                password: '654321'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})