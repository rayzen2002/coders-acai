test('GET to /users should return list of Users', async () => {
  const data = {
    password: 'validpassword',
    mode: 'test',
    username: 'testUser',
  }
  const loginResponse = await fetch('http://localhost:3333/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const response = await fetch('http://localhost:3333/users?mode=test', {
    headers: {
      Cookie: loginResponse.headers.get('Set-Cookie'),
    },
  })
  const responseContent = await response.json()
  expect(responseContent).toHaveProperty('testUsers')
  expect(Array.isArray(responseContent.testUsers)).toBe(true)
  expect(responseContent.testUsers.length).toBeGreaterThan(0)
  responseContent.testUsers.forEach((user) => {
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('password')
  })
  expect(response.status).toBe(200)
})
