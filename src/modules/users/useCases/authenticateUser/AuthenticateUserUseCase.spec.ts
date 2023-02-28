import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository


describe('Authenticate user', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })
   
    it('should be able to authenticate user', async () => {
        await createUserUseCase.execute({
            email: 'test@test.com.br',
            name: 'Test',
            password: '123456'
          })

        const authenticationInfo = await authenticateUserUseCase.execute({
            email: 'test@test.com.br',
            password: '123456'
        }) 

        expect(authenticationInfo).toHaveProperty('token')
        expect(authenticationInfo).toHaveProperty('user')
    })

    it('should be not able to authenticate user with incorrect email', async () => {        
        expect(async () => {
            await createUserUseCase.execute({
                email: 'test@test.com.br',
                name: 'Test',
                password: '123456'
            })

            await authenticateUserUseCase.execute({
                email: 'test@wrongmail.com.br',
                password: '123456'
            }) 
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)     
    })

    it('should be not able to authenticate user with incorrect password', async () => {        
        expect(async () => {
            await createUserUseCase.execute({
                email: 'test@test.com.br',
                name: 'Test',
                password: '123456'
            })

            await authenticateUserUseCase.execute({
                email: 'test@test.com.br',
                password: '654321-WRONNGGG'
            }) 
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)     
    })


})