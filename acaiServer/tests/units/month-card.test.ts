test('GET TO /metrics/month-total-revenue should return all receipt from the actual month and last month', async () => {
  const monthRevenueResponse = await fetch(
    'http://localhost:3333/metrics/month-total-revenue',
  )
  expect(monthRevenueResponse.status).toEqual(200)
})
