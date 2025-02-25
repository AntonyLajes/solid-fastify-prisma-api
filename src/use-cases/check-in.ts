import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFound } from "./erros/resource-not-found";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./erros/max-distance-error";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error";

interface CheckInUseCaseRequest {
    userId: string,
    gymId: string,
    latitude: number,
    longitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase{

    constructor(private checkInRepository: CheckInsRepository, private gymsRepository: GymsRepository){}

    async handler({ userId, gymId, latitude, longitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
        const gym = await this.gymsRepository.findById(gymId)

        if(!gym) {
            throw new ResourceNotFound()
        }

        
        const MAX_DISTANCE_IN_KILOMETERS = 0.1
        const distance = getDistanceBetweenCoordinates(
            {latitude, longitude},
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
        )

        if(distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceError()

        const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(userId, new Date())
        
        if(checkInOnSameDate) throw new MaxNumberOfCheckInsError()

        const checkIn = await this.checkInRepository.create({
            user_id: userId,
            gym_id: gymId
        })

        return {
            checkIn
        }
    }

}