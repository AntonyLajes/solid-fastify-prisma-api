import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";

describe('Authenticate Use Case', () => {

    it('should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

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
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await expect(
            sut.handler({
                email: 'john@email.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should be not able to authenticate with a wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

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