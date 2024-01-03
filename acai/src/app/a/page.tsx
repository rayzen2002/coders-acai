import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { jwtDecode } from 'jwt-decode'
import { AlertCircle } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
interface decodedAuthConfig{
  username: string,
  id: string,
  levelOfAccess: number
 }
export default function a(){
  const cookie = cookies()
  const auth = cookie.get('auth')
  const decodedAuth:decodedAuthConfig = jwtDecode(auth.value) 
  if(auth){
    if(decodedAuth.levelOfAccess === 3){
      return(
        <h1 className="w-screen h-screen  flex justify-center items-center text-9xl">Tenho credenciais para acessar esta página</h1>
      )
    }else{
      
      return(
        <>
        <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Você não possui autorização para acessar esta página.
      </AlertDescription>
    </Alert>
    <Link href='/home'>Voltar</Link>
    </>
      )
    }
    
  }else{
    alert('Faça login primeiro')
  }

 
}