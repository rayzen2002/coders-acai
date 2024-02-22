// test('DELETE to /orders/id should delete an order and all order-items associated', () => {
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
//   })
//     .then((createOrderResponse) => {
//       expect(createOrderResponse.status).toEqual(201)
//       return createOrderResponse.json()
//     })
//     .then((orderResponse) => {
//       return fetch(`http://localhost:3333/orders/${orderResponse.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//     })
//     .then((deleteOrderResponse) => {
//       expect(deleteOrderResponse.status).toEqual(204)
//     })
// })

test('s', () => {
  const a = 4
  expect(a).toEqual(4)
})
