import { EmailAlreadyExistsError } from "@/http/controllers/erros/email-already-exists-error"
import { prisma } from "@/lib/prisma"
import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"

interface RegisterUseCaseParams {
    name: string,
    email: string,
    password: string
}

export class RegisterUseCase {
    constructor(private userRepository: UsersRepository){}

    async handler({ name, email, password }: RegisterUseCaseParams){
        const userWithEmail = await this.userRepository.findByEmail(email)
    
        if(userWithEmail) throw new EmailAlreadyExistsError()
    
        const password_hash = await hash(password, 6)
        
        await this.userRepository.create({
            name,
            email,
            password_hash
        })
    }
}