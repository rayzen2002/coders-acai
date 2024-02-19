// test.skip('POST to /login should return 200 if user is valid', async () => {
//   const data = {
//     password: 'validpassword',
//     mode: 'test',
//     username: 'testUser',
//   }
//   const response = await fetch('http://localhost:3333/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   expect(response.status).toEqual(200)
// })

test('s', () => {
  const a = 4
  expect(a).toEqual(4)
})
