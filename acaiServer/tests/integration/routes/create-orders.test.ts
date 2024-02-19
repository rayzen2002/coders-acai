test('POST to /order should create an empty order than filling it with orderItems', () => {
  const orderBody = {
    customerId: '0e0b8cb4-0747-4c27-b8de-1d1ff32ecc2f',
    orderItems: [
      {
        productName: 'Small Fresh Fish',
        quantity: 55,
      },
      {
        productName: 'Refined Plastic Computer',
        quantity: 88,
      },
    ],
  }
  fetch('http://localhost:3333/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderBody),
  }).then((createOrderResponse) => {
    expect(createOrderResponse.status).toEqual(201)
    return createOrderResponse.json()
  })
})
