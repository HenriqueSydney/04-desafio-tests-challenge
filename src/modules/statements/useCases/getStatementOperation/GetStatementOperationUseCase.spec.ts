import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from './GetStatementOperationError';

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';


let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository

let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Get/show Balance of a User', ()=> {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository()       
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    })

    it('should be able to show a operation by user ID and Operation ID', async () => {
        const user = await usersRepositoryInMemory.create({
            email: 'test@test.com.br',
            name: 'Test',
            password: '123456'
        })

        const statement = await statementsRepositoryInMemory.create({
            user_id: user.id as string,
            amount: 10000,
            description: 'Salary',
            type: OperationType.DEPOSIT
        })

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string, 
            statement_id: statement.id as string
        })
        
        expect(statementOperation).toEqual(statement) 

    })

    it('should not be able to show a non user operation', async () => {      
        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                email: 'test@test.com.br',
                name: 'Test',
                password: '123456'
            })

            const statement = await statementsRepositoryInMemory.create({
                user_id: user.id as string,
                amount: 10000,
                description: 'Salary',
                type: OperationType.DEPOSIT
            })

            await getStatementOperationUseCase.execute({
                user_id: 'FAKE_USER_ID_FOR_TEST', 
                statement_id: statement.id as string
            })          

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it('should not be able to show a not found operation for a existing user', async () => {      
        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                email: 'test@test.com.br',
                name: 'Test',
                password: '123456'
            })

           await statementsRepositoryInMemory.create({
                user_id: user.id as string,
                amount: 10000,
                description: 'Salary',
                type: OperationType.DEPOSIT
            })

            await getStatementOperationUseCase.execute({
                user_id: user.id as string, 
                statement_id: 'FAKE_OPERATION_ID_FOR_TEST'
            })          

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })

    it('should not be able to show a existing operation of a different user', async () => {      
        expect(async () => {
            const firstUser = await usersRepositoryInMemory.create({
                email: 'test@test.com.br',
                name: 'Test',
                password: '123456'
            })

            const secondUser = await usersRepositoryInMemory.create({
                email: 'test2@test.com.br',
                name: 'Test 2',
                password: '123456'
            })

           const firstUserStatement = await statementsRepositoryInMemory.create({
                user_id: firstUser.id as string,
                amount: 10000,
                description: 'Salary',
                type: OperationType.DEPOSIT
            })

            await getStatementOperationUseCase.execute({
                user_id: secondUser.id as string, 
                statement_id: firstUserStatement.id as string
            })          

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })

})