"use client"

import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import denunciar from '@/pages/api/denunciar'

export default function AbuseReportForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const router = useRouter();
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      const setor = (event.target as HTMLFormElement).department.value;
      const individuo = (event.target as HTMLFormElement)["reported-person"].value;
      const descricao = (event.target as HTMLFormElement).description.value;
    
      try {
        const response = await fetch('/api/denunciar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ setor, individuo, descricao }),
        });
    
        if (response.ok) {
          setIsSubmitted(true);
          console.log("Formulário enviado com sucesso!");
        } else {
          console.error("Erro ao enviar a denúncia:", await response.json());
        }
      } catch (error) {
        console.error("Erro ao enviar a denúncia:", error);
      }
    };
    
  
    if (isSubmitted) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Denúncia Recebida</AlertTitle>
                <AlertDescription>
                  Sua denúncia foi registrada e será investigada com sigilo. Obrigado por ajudar a manter um ambiente de trabalho seguro.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
                <Button type="button" className="w-full bg-black hover:bg-blue-500" onClick={() => router.push('/')}>
                  Retornar à Intranet
                </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Denúncia de Abuso</CardTitle>
            <CardDescription>
              Use este formulário para denunciar situações de abuso no ambiente de trabalho. Sua denúncia será tratada com confidencialidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Setor onde ocorreu</Label>
                <Select required>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rh">Recursos Humanos</SelectItem>
                    <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reported-person">Quem está sendo denunciado</Label>
                <Input id="reported-person" placeholder="Nome da pessoa ou cargo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da situação</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o ocorrido com o máximo de detalhes possível"
                  required
                  className="min-h-[100px]"
                />
              </div>
              <CardFooter className='p-0'>
                <Button type="submit" className="w-full bg-black hover:bg-red-500 my-4">
                  Enviar Denúncia
                </Button>
              </CardFooter>
            </form>
            <Button type="button" className="w-full bg-black hover:bg-blue-500" onClick={() => router.push('/')}>
                Voltar à Intranet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
