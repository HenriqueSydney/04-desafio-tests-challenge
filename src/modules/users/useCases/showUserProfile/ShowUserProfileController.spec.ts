import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import { createDatabaseConnection } from '../../../../database'

// import createConnection from '../../../../database/index'

let connection: Connection
describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createDatabaseConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to show a user profile', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
    })

    const authenticationResponse = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'test@test.com',
        password: '123456',
      })

    const { token, user } = authenticationResponse.body
    const profile = await request(app)
      .get(`/api/v1/profile`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(profile.body).toHaveProperty('id')
    expect(profile.body.id).toEqual(user.id)
  })
})
