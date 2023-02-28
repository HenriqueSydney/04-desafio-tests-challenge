import { ShowUserProfileError } from './ShowUserProfileError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  })

  it('it should be show user profile by id', async () => {    

    const userCreated = await usersRepositoryInMemory.create({
        email: 'test@test.com.br',
        name: 'Test',
        password: '123456'
      })
  
    const { id } = userCreated

    const user = await showUserProfileUseCase.execute(id as string)

    expect(user).toEqual(userCreated)
  })

  it('it should not be show non user profile by id', async () => {    
    
    expect(async () => {
        const user = await showUserProfileUseCase.execute('12345')
    }).rejects.toBeInstanceOf(ShowUserProfileError)    
  
  })

})