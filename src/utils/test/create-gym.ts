import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

export default async function createGym() {
    const createGymUseCase = makeCreateGymUseCase()
    
    const { gym } =  await createGymUseCase.handler({
        title: `Academia Teste 1`,
        description: `Academia teste 1`,
        phone: '123456789',
        latitude: -21.2006301,
        longitude: -50.4661626,
    })

    return {
        gym
    }
}