import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
interface decodedAuthConfig{
  username: string,
  id: string,
  levelOfAccess: number
 }
export default function b(){
  const cookie = cookies()
  const auth = cookie.get('auth')
  const decodedAuth:decodedAuthConfig = jwtDecode(auth.value) 
  if(auth){
    if(decodedAuth.levelOfAccess === 2){
      return(
        <h1 className="w-screen h-screen  flex justify-center items-center text-9xl">Tenho credenciais para acessar esta página</h1>
      )
    }else{
      console.log(decodedAuth.levelOfAccess)
      return(
        <h1>{decodedAuth.levelOfAccess}</h1>
      )
    }
    
  }else{
    alert('Faça login primeiro')
  }

 
}