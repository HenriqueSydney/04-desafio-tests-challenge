import request from 'supertest'
import { Connection } from 'typeorm';
import { app } from '../../../../app'
import createConnection from "../../../../database/index";

let connection: Connection
describe('Get Balance Controller', () => {
    beforeEach(async () => {
        connection = await createConnection();
        await connection.runMigrations()
       
      })
    
      afterEach(async () => {
        await connection.dropDatabase()
        await connection.close()
      })
  
  it('should able to get balance', async () => {
    await request(app).post('/api/v1/users').send({
        name: 'Test User',
        email: 'test@test.com',
        password: '12345',
    })  
    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        email: 'test@test.com',
        password: '12345',
    }) 

    const { token, user } = authenticationResponse.body
      
    const opa1 = await request(app)
    .post('/api/v1/statements/deposit')
    .send({
        amount: 10,
        description: 'Salary',
    }).set({
        Authorization: `Bearer ${token}`,
    })   
     
    const opa2 = await request(app)
    .post('/api/v1/statements/deposit')
    .send({
        amount: 150,
        description: 'Freelancer Gig',
    }).set({
        Authorization: `Bearer ${token}`,
    })  

    const opa3 = await request(app)
    .post('/api/v1/statements/withdraw')
    .send({
        amount: 100,
        description: 'New Computer',
    }).set({
        Authorization: `Bearer ${token}`,
    }) 

    const balance = await request(app)
    .get('/api/v1/statements/balance') 
    .send({
        user_id:user.id
    })
    .set({
        Authorization: `Bearer ${token}`,
    })  

    expect(balance.status).toBe(200)
    expect(balance.body).toHaveProperty('balance')
    expect(balance.body.statement.length).toEqual(3)
  })
})
