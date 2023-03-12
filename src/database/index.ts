import { Connection, createConnection, getConnectionOptions } from 'typeorm'

async function createDatabaseConnection(): Promise<Connection> {
  const defaultOptions = await getConnectionOptions()

  return await createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : 'fin_api',
      database:
        process.env.NODE_ENV === 'test'
          ? 'test_financial_statement'
          : 'fin_api',
    }),
  )
}

export { createDatabaseConnection }

/* interface IOptions {
  host: string
  database: string
}

getConnectionOptions().then((options) => {
  const newOptions = options as IOptions
  newOptions.host = process.env.NODE_ENV === 'test' ? 'localhost' : 'database'
  newOptions.database =
    process.env.NODE_ENV === 'test' ? 'fin_api_test' : 'fin_api'

  createConnection({
    ...options,
  })
})

export default async (host = 'fin_api'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions()

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'test_financial_statement'
          : defaultOptions.database,
    }),
  )
}
*/
