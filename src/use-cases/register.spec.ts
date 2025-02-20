import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { expect, it, describe } from "vitest"
import { RegisterUseCase } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { EmailAlreadyExistsError } from "./erros/email-already-exists-error"

describe('Register Use Case', () => {
    it('should hash user password uppon registration', async () => {
        const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())

        const { user } = await registerUseCase.handler({
            name: 'John Doe',
            email: 'john@email.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    }),

    it('should not register when email already exists', async () => {
        const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())

        const email = 'john@email.com'

        await registerUseCase.handler({
            name: 'John Doe',
            email,
            password: '123456'
        })

        await expect(
            registerUseCase.handler({
                name: 'John Doe',
                email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(EmailAlreadyExistsError)

    })
})