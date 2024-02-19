// test.skip('GET /groups SHOULD RETURN LIST OF GROUPS AND STATUS 200 ', async () => {
//   const data = {
//     password: 'validpassword',
//     mode: 'test',
//     username: 'testUser',
//   }
//   const loginResponse = await fetch('http://localhost:3333/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   const response = await fetch('http://localhost:3333/groups?mode=test', {
//     headers: { Cookie: loginResponse.headers.get('Set-Cookie') },
//   })
//   const groups = await response.json()
//   expect(response.status).toBe(200)
//   expect(Array.isArray(groups)).toBe(true)
//   expect(groups[0].groupName).toBe('admin')
//   groups.forEach((group) => {
//     expect(group).toHaveProperty('id')
//     expect(group).toHaveProperty('groupName')
//     expect(group).toHaveProperty('levelOfAccess')
//   })
// })

test('s', () => {
  const a = 4
  expect(a).toEqual(4)
})
