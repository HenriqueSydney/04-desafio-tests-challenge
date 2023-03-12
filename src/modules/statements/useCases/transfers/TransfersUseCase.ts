import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'

import { OperationType, Statement } from '../../entities/Statement'

import { TransferError } from './TransferError'

interface IRequest {
  sender_id: string
  user_id: string
  amount: number
  description: string
}

interface IResponse {
  operation_in_user_account: Statement
  operation_in_sender_account: Statement
}

@injectable()
class TransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute({
    sender_id,
    user_id,
    amount,
    description,
  }: IRequest): Promise<IResponse> {
    const senderExists = await this.usersRepository.findById(sender_id)

    if (!senderExists) {
      throw new TransferError.SenderNotFound()
    }
    console.log({
      sender_id,
      user_id,
      amount,
      description,
    })
    const userExists = await this.usersRepository.findById(user_id)

    if (!userExists) {
      throw new TransferError.UserNotFound()
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    })

    if (balance < amount) {
      throw new TransferError.InsufficientFunds()
    }

    const transferOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    })

    const transferOperationDebit = await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.TRANSFER,
      amount: amount * -1,
      description,
    })

    const transferOperations = {
      operation_in_user_account: transferOperation,
      operation_in_sender_account: transferOperationDebit,
    }

    return transferOperations
  }
}

export { TransferUseCase }
