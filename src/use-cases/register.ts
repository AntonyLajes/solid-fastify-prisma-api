import { prisma } from "@/lib/prisma"
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository"
import { hash } from "bcryptjs"

interface RegisterUseCaseParams {
    name: string,
    email: string,
    password: string
}

export async function registerUseCase({ name, email, password }: RegisterUseCaseParams){
    const prismaUsersRepository = new PrismaUsersRepository()
    
    const userWithEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(userWithEmail) throw new Error("Email already exists.")

    const password_hash = await hash(password, 6)
    
    await prismaUsersRepository.create({
        name,
        email,
        password_hash
    })
}