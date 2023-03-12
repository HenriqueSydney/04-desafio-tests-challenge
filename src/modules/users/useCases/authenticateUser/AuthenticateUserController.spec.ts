import request from 'supertest'

import { Connection } from 'typeorm'
import { app } from '../../../../app'
import { createDatabaseConnection } from '../../../../database'

// import createConnection from '../../../../database/index'

let connection: Connection
describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createDatabaseConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to authenticate a user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
    })

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '123456',
    })

    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('token')
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test@test.com',
      password: '12345',
    })

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '12345',
    })

    expect(response.status).toBe(401)
  })

  it('should not be able to authenticate a user with wrong email', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test@test.com',
      password: '12345',
    })

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'WRONG@test.com',
      password: '12345',
    })

    expect(response.status).toBe(401)
  })
})
