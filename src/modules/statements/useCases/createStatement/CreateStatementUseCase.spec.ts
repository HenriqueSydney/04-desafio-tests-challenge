import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"

import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let usersRepositoryInMemory: InMemoryUsersRepository

let createStatementUseCase: CreateStatementUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Create Statement', ()=> {


    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    })

    it('should be able to create a statement', async () => {
        const user = await usersRepositoryInMemory.create({
            email: 'test@test.com.br',
            name: 'Test',
            password: '123456'
        })

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            amount: 10000,
            description: 'Salary',
            type: OperationType.DEPOSIT
        })

        expect(statement).toHaveProperty('id')
    })

    it('should not be able to create a statement if the user is not found', async () => {
       
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: 'FAKE_ID_FOR_TEST',
                amount: 100,
                description: 'Delicious Burger with Fries',
                type: OperationType.WITHDRAW
            })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)      

    })

    it('should not be able to withdraw if there is not enough balance - InsufficientFunds', async () => {
       
        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                email: 'test@test.com.br',
                name: 'Test',
                password: '123456'
            })
           
            await createStatementUseCase.execute({
                user_id: user.id as string,
                amount: 100,
                description: 'Delicious Burger with Fries',
                type: OperationType.WITHDRAW
            })
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)      

    })

})