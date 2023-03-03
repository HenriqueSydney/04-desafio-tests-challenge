import request from 'supertest'
import { Connection } from 'typeorm';
import { app } from '../../../../app'

import createConnection from "../../../../database/index";

let connection: Connection
describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
   
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create user', async () => {
    const response = await request(app).post('/api/v1/users').send({
        name: 'Test User',
        email: 'test@test.com',
        password: '12345',
    }) 
    expect(response.status).toBe(201)
  })

  it('should not be able to create user with same email', async () => {
   await request(app).post('/api/v1/users').send({
        name: 'Test User',
        email: 'test@test.com',
        password: '12345',
    })  
    
    const response = await request(app).post('/api/v1/users').send({
        name: 'Test User 2',
        email: 'test@test.com',
        password: '54321',
    }) 
    
  
    expect(response.status).toBe(400)
  })
})
