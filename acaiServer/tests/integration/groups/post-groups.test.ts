test('POST TO /groups SHOULD CREATE A NEW GROUP AND RETURN 201', async () => {
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
  const groupData = {
    groupName: 'test',
    levelOfAccess: 2,
    mode: 'test',
  }
  const response = await fetch('http://localhost:3333/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: loginResponse.headers.get('Set-Cookie'),
    },
    body: JSON.stringify(groupData),
  })
  expect(response.status).toEqual(201)
})
