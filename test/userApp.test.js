const request = require('supertest')
const { express } = require('express')
const { validate } = require('uuid');

const app = require('../src/userApp').app
let userId;
test("GET /api/users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.body).toStrictEqual([]);

});
test("POST /api/users", async () => {
    const newUser={
        "username": "Amrutha",
        "age": 21,
        "hobbies": ["reading books"
        ]
    }
    const response = await request(app).post('/api/users')
    .send(newUser)
    userId=response.body._id
    expect(validate(response.body._id)).toStrictEqual(true)
    expect({
        "username": response.body.username,
        "age": response.body.age,
        "hobbies": response.body.hobbies
    }).toStrictEqual({
        "username": "Amrutha",
        "age": 21,
        "hobbies": ["reading books"
        ]
    })

})

test("PUT /api/users/userId", async () => {
    const response = await request(app).put('/api/users/'+userId)
    .send({age:33})
    expect(response.body._id).toStrictEqual(userId);

})

test("GET /api/users/userId", async () => {
    const response = await request(app).get('/api/users/'+userId)

    expect(response.body[0]._id).toStrictEqual(userId)

})

test("DELETE /api/users/userId", async () => {
    const response = await request(app).delete('/api/users/'+userId)
    expect(response.statusCode).toBe(204);

})
//
test("GET /api/users/userId", async () => {
    const response = await request(app).get('/api/users/'+userId)

    expect(response.body).toStrictEqual("userId doesn't exist")

})

