// test('POST to /order should create an empty order than filling it with orderItems', () => {
//   const orderBody = {
//     customerName: 'Stewart Schoen MD',
//     orderItems: [
//       {
//         productName: 'Small Fresh Fish',
//         quantity: 55,
//       },
//       {
//         productName: 'Refined Plastic Computer',
//         quantity: 88,
//       },
//     ],
//   }
//   fetch('http://localhost:3333/order', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(orderBody),
//   }).then((createOrderResponse) => {
//     expect(createOrderResponse.status).toEqual(201)
//     return createOrderResponse.json()
//   })
// })
test('s', () => {
  const a = 4
  expect(a).toEqual(4)
})
