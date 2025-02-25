import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFound } from "./erros/resource-not-found";

interface GetUserProfileRequest {
    userId: string
}

interface GetUserProfileResponse {
    user: User
}

export class GetUserProfileUseCase{

    constructor(private usersRepository: UsersRepository){}

    async handler( { userId }: GetUserProfileRequest ): Promise<GetUserProfileResponse>{
        const user = await this.usersRepository.findById(userId)

        if(!user) throw new ResourceNotFound()

        return {
            user
        }
    }

}