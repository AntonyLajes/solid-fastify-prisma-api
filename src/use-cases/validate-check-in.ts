import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFound } from "./erros/resource-not-found";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "@/repositories/in-memory/late-check-in-validation-error";

interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {

    constructor(private checkInsRepository: CheckInsRepository){}

    async handler({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse>{
        const checkIn = await this.checkInsRepository.findByCheckInId(checkInId)
    
        if(!checkIn) throw new ResourceNotFound()
        
        const now = new Date()
        const distanceInMinutesFromCheckInCreation = dayjs(now).diff(checkIn.created_at, 'minutes')

        if(distanceInMinutesFromCheckInCreation > 20) throw new LateCheckInValidationError()

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn
        }
    }

}