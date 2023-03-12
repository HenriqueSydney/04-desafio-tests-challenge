import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import { createDatabaseConnection } from '../../../../database/index'

let connection: Connection
describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createDatabaseConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a withdraw statement', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test@test.com',
      password: '12345',
    })
    const authenticationResponse = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'test@test.com',
        password: '12345',
      })

    const { token } = authenticationResponse.body

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: 'Deposit test for withdraw',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 100,
        description: 'Withdraw test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(201)
  })

  it('should be able to create a deposit statement', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test@test.com',
      password: '12345',
    })

    const authenticationResponse = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'test@test.com',
        password: '12345',
      })

    const { token } = authenticationResponse.body

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: 'Deposit test for withdraw',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(201)
  })

  it('should not be able to create a withdraw statement for user with Insufficient Funds', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test22@test.com',
      password: '123456',
    })

    const authenticationResponse = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'test22@test.com',
        password: '123456',
      })

    const { token } = authenticationResponse.body
    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'Salary',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 150,
        description: 'New Computer',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(400)
  })
})
