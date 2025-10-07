"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, ShieldAlert, Info, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AbuseReportForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
    
      const descricao = (event.target as HTMLFormElement).description.value;
    
      try {
        const response = await fetch('/api/denunciar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ descricao }),
        });
    
        if (response.ok) {
          setIsSubmitted(true);
          console.log("Formulário enviado com sucesso!");
        } else {
          console.error("Erro ao enviar a denúncia:", await response.json());
        }
      } catch (error) {
        console.error("Erro ao enviar a denúncia:", error);
      } finally {
        setIsSubmitting(false);
      }
    };    
  
    if (isSubmitted) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <Card className="w-full max-w-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                  <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">Denúncia Recebida com Sucesso</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Sua denúncia foi registrada e será investigada com <strong>total sigilo</strong>. 
                    Obrigado por ajudar a manter um ambiente de trabalho seguro e ético.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                type="button" 
                className="w-full" 
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retornar à Intranet
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho da página */}
          <div className="text-center mb-8 space-y-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-4">
                <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Canal de Tratamento de Denúncias
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Espaço seguro e anônimo para denúncias de violação ao código de ética
            </p>
          </div>

          {/* Cards principais */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Card do formulário */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                  Realizar Denúncia
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Este canal tem como objetivo proporcionar um espaço para nossos funcionários realizarem 
                  denúncias e/ou queixas que violam o nosso código de ética, onde o <strong>anonimato e sigilo 
                  serão garantidos</strong>.
                </CardDescription>
                <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
                    <strong>Importante:</strong> Quanto mais detalhada for a sua denúncia, maiores serão as 
                    chances de identificação e solução do problema.
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Descrição da Situação <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o ocorrido com o máximo de detalhes possível: o que aconteceu, quando, onde, quem estava envolvido, testemunhas, etc."
                      required
                      className="min-h-[200px] resize-y"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Sua identidade será mantida em sigilo absoluto durante todo o processo.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base text-white font-semibold bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mr-2 h-5 w-5" />
                          Enviar Denúncia
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-11"
                      onClick={() => router.push('/')}
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar à Intranet
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Card informativo */}
            <Card className="shadow-lg lg:sticky lg:top-8 h-fit">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600" />
                  Como Funciona o Processo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Registro da Denúncia</h3>
                      <p className="text-sm text-muted-foreground">
                        Sua denúncia é registrada de forma anônima e segura em nosso sistema.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Análise pelo Comitê</h3>
                      <p className="text-sm text-muted-foreground">
                        Um comitê específico analisa a denúncia e inicia as investigações necessárias.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Investigação Sigilosa</h3>
                      <p className="text-sm text-muted-foreground">
                        Coleta de provas e evidências com máximo sigilo e cautela.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Medidas Disciplinares</h3>
                      <p className="text-sm text-muted-foreground">
                        Ações são tomadas de acordo com o código de ética da empresa.
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                  <ShieldAlert className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 dark:text-blue-300">Garantia de Sigilo</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
                    Todo o processo é conduzido com total confidencialidade. Sua identidade jamais será revelada 
                    sem sua autorização expressa.
                  </AlertDescription>
                </Alert>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Agradecemos o seu contato e sua contribuição para manter um ambiente de trabalho ético e seguro.
                  </p>
                  <p className="text-sm font-semibold mt-2">
                    Grupo Plínio Fleck
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}
