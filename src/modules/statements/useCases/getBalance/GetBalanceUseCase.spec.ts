import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { GetBalanceError } from './GetBalanceError'
import { GetBalanceUseCase } from './GetBalanceUseCase'

let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository

let getBalanceUseCase: GetBalanceUseCase

describe('Get/show Balance of a User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory,
    )
  })

  it('should be able to show a user balance', async () => {
    const user = await usersRepositoryInMemory.create({
      email: 'test@test.com.br',
      name: 'Test',
      password: '123456',
    })

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      amount: 10000,
      description: 'Salary',
      type: OperationType.DEPOSIT,
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    })

    expect(balance).toHaveProperty('balance')
    expect(balance).toHaveProperty('statement')
    expect(balance.statement).toEqual([statement])
  })

  it('should not be able to show a non user balance', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'FAKE_USER_ID_FOR_TEST' })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
