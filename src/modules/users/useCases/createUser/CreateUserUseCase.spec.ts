import { CreateUserError } from './CreateUserError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('it should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'Test',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
  })

  it('it should not be able to create a new user with same email', async () => {
    
    expect(async () => {
      await createUserUseCase.execute({
        email: 'test@test.com.br',
        name: 'Test',
        password: '123456'
      })

      await createUserUseCase.execute({
        email: 'test@test.com.br',
        name: 'Test2',
        password: '125641651'
      })
  
    }).rejects.toBeInstanceOf(CreateUserError)
   
   
  })

})