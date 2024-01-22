'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>
interface authForm {
  username: string
  password: string
}
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    const target = event.target as typeof event.target & {
      name: { value: string }
      password: { value: string }
    }
    const body: authForm = {
      username: target.name.value,
      password: target.password.value,
    }

    const loginResponse = await axios.post('/login', body, {
      baseURL: 'http://localhost:3333',
      withCredentials: true,
    })

    console.log(loginResponse)
    if (loginResponse.status === 200) {
      console.log('logado')
      router.push('/dashboard')
    }
    if (loginResponse.status === 401) {
      alert('Login invalido')
      router.refresh()
      event.target.name.value = ''
      event.target.password.value = ''
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Username
            </Label>
            <Input
              id="name"
              placeholder="name"
              type="name"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button className="bg-purple-700">Entrar</Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase"></div>
      </div>
    </div>
  )
}
