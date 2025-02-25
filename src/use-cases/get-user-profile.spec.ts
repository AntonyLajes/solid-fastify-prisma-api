import { UsersRepository } from "@/repositories/users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { ResourceNotFound } from "./erros/resource-not-found";

let usersRepository: UsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get user profile', async () => {
        const name = 'John Doe'
        
        const createdUser = await usersRepository.create({
            name,
            email: 'john@email.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.handler({userId: createdUser.id})
        
        expect(user.name).toBe(name)
    })

    it('should not able to get user profile', async () => {
        await expect(
            sut.handler({userId: '123456'})
        ).rejects.toBeInstanceOf(ResourceNotFound)
    })

})