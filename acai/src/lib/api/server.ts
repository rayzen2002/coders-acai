import axios from "axios";

export async function server(){
   const server = await axios.create({
    baseURL: 'http://localhost:3333'
  })
  return server
}
