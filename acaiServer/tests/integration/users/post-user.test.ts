test('POST to /user should create a user', async () => {
  const loginData = {
    password: 'validpassword',
    mode: 'test',
    username: 'testUser',
  }
  const loginResponse = await fetch('http://localhost:3333/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })
  const data = {
    username: 'testUser',
    password: 'validpassword',
    mode: 'test',
    group: ['admin'],
  }
  const response = await fetch('http://localhost:3333/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: loginResponse.headers.get('Set-Cookie'),
    },
    body: JSON.stringify(data),
  })
  expect(response.status).toEqual(201)
})
