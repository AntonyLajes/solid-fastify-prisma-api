import { EmailAlreadyExistsError } from "@/use-cases/erros/email-already-exists-error"
import { prisma } from "@/lib/prisma"
import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { User } from "@prisma/client"

interface RegisterUseCaseParams {
    name: string,
    email: string,
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private userRepository: UsersRepository){}

    async handler({ name, email, password }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse>{
        const userWithEmail = await this.userRepository.findByEmail(email)
    
        if(userWithEmail) throw new EmailAlreadyExistsError()
    
        const password_hash = await hash(password, 6)
        
        const user = await this.userRepository.create({
            name,
            email,
            password_hash
        })

        return {
            user
        }
    }
}