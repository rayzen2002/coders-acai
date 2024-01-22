'use client'
import 'dotenv/config'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ToastAction } from './ui/toast'
import { toast } from './ui/use-toast'
type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>
interface authForm {
  username: string
  password: string
}
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isInvalid, setIsInvalid] = React.useState(false)
  const [isErrorDisplayed, setIsErrorDisplayed] = React.useState(false)
  const router = useRouter()
  React.useEffect(() => {
    isInvalidUser()
  })
  async function isInvalidUser() {
    if (isInvalid && !isErrorDisplayed) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description: 'Houve um problema com suas credenciais.',
        action: <ToastAction altText="Try again">Tente novamente</ToastAction>,
      })
      setIsErrorDisplayed(true)
    }
  }
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

    try {
      await axios.post('/login', body, {
        baseURL: process.env.NEXT_PUBLIC_API_KEY,
        withCredentials: true,
      })
      router.push('/dashboard')
    } catch (error) {
      setIsInvalid(true)
      target.password.value = ''
      target.name.value = ''
      router.refresh()
      setIsLoading(false)
    }
    await isInvalidUser()
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
          <Button disabled={isLoading} className="bg-purple-700">
            Entrar
          </Button>
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
