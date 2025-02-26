import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserCheckInsMetricsRequest { 
    userId: string
}

interface GetUserCheckInsMetricsResponse {
    checkInsMetrics: number
}

export class GetUserCheckInsMetricsUseCase {

    constructor(private checkInsRepository: CheckInsRepository){}

    async handler({ userId }: GetUserCheckInsMetricsRequest): Promise<GetUserCheckInsMetricsResponse>{
        const checkInsMetrics = await this.checkInsRepository.findCheckInsMetricsByUserId(userId)

        return {
            checkInsMetrics
        }
    }

}