import { Statement } from '../entities/Statement'

export class BalanceMap {
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[]
    balance: number
  }) {
    const parsedStatement = statement.map(
      ({
        id,
        amount,
        description,
        type,
        created_at,
        updated_at,
        sender_id,
      }) => {
        const statementOperation = {
          id,
          amount: Number(amount),
          description,
          type,
          sender_id,
          created_at,
          updated_at,
        }

        if (!sender_id) {
          delete statementOperation.sender_id
        }

        return statementOperation
      },
    )

    return {
      statement: parsedStatement,
      balance: Number(balance),
    }
  }
}
