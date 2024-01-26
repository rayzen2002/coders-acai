'use client'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast, useToast } from '@/components/ui/use-toast'

export default function Customers() {
  const { toast } = useToast()
  function toastCall(event: Event) {
    event.preventDefault()
    toast({
      description: 'Usuário cadastrado com sucesso.',
    })
  }
  return (
    <>
      <Header />
      <div className="flex flex-col gap-4  pt-4">
        <h1 className="text-3xl flex items-center mx-auto">
          Cadastro de Clientes
        </h1>
        <Separator />
        <form action="" className="flex flex-col gap-2 ml-4">
          <Label htmlFor="name">Nome do Cliente:</Label>
          <Input className="w-[25%] bg-transparent" />
          <Label htmlFor="name">Email:</Label>
          <Input
            className="w-[15%] text-muted-foreground bg-transparent"
            placeholder="name@email.com"
          />
          <Label htmlFor="name">Endereco:</Label>
          <Input className="w-[25%] bg-transparent" />
          <Label htmlFor="name">CNPJ:</Label>
          <Input
            className="w-[10%] bg-transparent"
            placeholder="XXXXXX-XXXXX"
          />
          <Label htmlFor="name">Telefone:</Label>
          <Input
            className="w-[10%] bg-transparent"
            placeholder="(XX)-XXXXXXX"
          />
          <Button onClick={toastCall} className="w-32 mt-4">
            Cadastrar
          </Button>
        </form>
      </div>
    </>
  )
}
