import request from 'supertest'
import { Connection } from 'typeorm';
import { app } from '../../../../app'

import createConnection from "../../../../database/index";

let connection: Connection
describe('Create Statement Operation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
   
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })
  
  it('should be able to get statement operation', async () => {
    await request(app).post('/api/v1/users').send({
        name: 'Test User',
        email: 'test@test.com',
        password: '12345',
    })  

    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        email: 'test@test.com',
        password: '12345',
    }) 

    const { token } = authenticationResponse.body

    await request(app)
    .post('/api/v1/statements/deposit')
    .send({
        amount: 100,
        description: 'Burgers for life'
    }).set({
        Authorization: `Bearer ${token}`,
    })   

    

    const balance = await request(app)
    .get('/api/v1/statements/balance')
    .set({
        Authorization: `Bearer ${token}`,
    })  

    
    const { id } = balance.body.statement[0]

    const response = await request(app)
    .get(`/api/v1/statements/${id}`)
    .set({
        Authorization: `Bearer ${token}`,
    }) 
    
    expect(response.body).toHaveProperty('id')

  })

})
