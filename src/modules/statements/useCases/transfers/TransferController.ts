import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { TransferUseCase } from './TransfersUseCase'

class TransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params
    const { amount, description } = request.body
    const { id: sender_id } = request.user

    const transferUseCase = container.resolve(TransferUseCase)

    const transfer = await transferUseCase.execute({
      sender_id,
      user_id: String(user_id),
      amount,
      description,
    })

    return response.status(201).json(transfer)
  }
}

export { TransferController }
