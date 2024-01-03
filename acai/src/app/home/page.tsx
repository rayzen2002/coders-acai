import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
interface decodedAuthConfig{
  username: string,
  id: string,
  levelOfAccess: number
 }
export default function test(){
  const cookie = cookies()
  const auth = cookie.get('auth')

    const decodedAuth:decodedAuthConfig = jwtDecode(auth.value) 
    console.log(decodedAuth.username)
    
  
  const { username, levelOfAccess } = decodedAuth
  return (
   <>
   <div className="flex flex-col bg-purple-700">
    <a href="/a" className="text-5xl">Nivel 3 </a>
    <a href="/b" className="text-5xl">Nivel 2</a>
    </div>
   </>
  )
}