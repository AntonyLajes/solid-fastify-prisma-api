import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { GetUserCheckInsMetricsUseCase } from "../get-user-check-ins-metrics";

export function makeFetchUserCheckInsMetricsUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new GetUserCheckInsMetricsUseCase(checkInsRepository)

    return useCase
}