"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

export default function AbuseReportForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [setor, setSetor] = useState('');  // Estado para capturar o setor selecionado
    const router = useRouter();
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      // Captura apenas o campo de descrição
      const descricao = (event.target as HTMLFormElement).description.value;
    
      try {
        const response = await fetch('/api/denunciar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ descricao }), // Passa apenas a descrição
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
            <CardTitle className='text-xl'>Canal de Tratamento de Denúncias</CardTitle>
            <CardDescription>
            Esse tem canal tem como objetivo proporcionar um espaço para nossos funcionários realizar uma denúncia e/ou queixa que viola o nosso código de ética, onde o anonimato e sigilo serão garantidos.
            <br/><br/>
            Por favor, preencha as informações da forma mais completa e detalhada possível. Lembre-se: quanto mais detalhada for a sua denúncia, maiores serão as chances de que o fato seja identificado e solucionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
        <Separator orientation="vertical" className="mx-4 h-96 w-[2px] bg-gray-300 opacity-80" />
        <Card className="w-full max-w-md h-full p-4">
          <CardContent className='p-0'>
              <p className='border-gray-400 border-2 p-4 rounded-lg'>Após o registro da sugestão ou da denúncia, estas informações serão direcionadas a um comitê específico. Esse comitê será o responsável pelas investigações, e pela coleta de provas e evidências, buscando tratar com o maior sigilo e cautela estas situações, bem como por tomar as medidas disciplinares de acordo ao nosso código de ética da empresa.
                <br/><br/>
                Agradecemos o seu contato.
                <br/> 
                Grupo Plínio Fleck
              </p>
            </CardContent>
        </Card>
      </div>
    );
}
