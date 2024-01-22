import axios from 'axios'

export async function server() {
  const server = await axios.create({
    baseURL: process.env.API_HOST,
  })
  return server
}
