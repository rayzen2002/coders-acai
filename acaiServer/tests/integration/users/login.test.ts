test.only('POST to /login should return 200 if user is valid', async () => {
  const listOfUsersReponse = await fetch('http://localhost:3333/users')
  expect(listOfUsersReponse.status).toEqual(200)
  const listOfUsers = await listOfUsersReponse.json()

  listOfUsers.users.map(async (user) => {
    if (user.username !== 'testUser') {
      const userData = {
        username: 'testUser',
        password: 'validpassword',
        group: ['admin'],
      }
      const userResponse = await fetch('http://localhost:3333/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      expect(userResponse.status).toEqual(201)
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      expect(response.status).toEqual(200)
    } else {
      const data = {
        password: 'validpassword',
        username: 'testUser',
      }
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      expect(response.status).toEqual(200)
    }
  })
})
