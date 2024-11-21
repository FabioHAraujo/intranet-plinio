'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import PocketBase from 'pocketbase';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

// Validação do formulário com Zod
const formSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um endereço de e-mail válido.',
  }),
  password: z.string().min(8, {
    message: 'A senha deve ter pelo menos 8 caracteres.',
  }),
});

// Tipo específico para o erro do PocketBase
interface PocketBaseError {
  message: string;
  code?: number;
  data?: Record<string, unknown>;
}

export default function TelaDeLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Configuração do react-hook-form com Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Submissão do formulário
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Autenticação no PocketBase
      await pb.collection('usuarios_intranet').authWithPassword(
        values.email,
        values.password
      );

      // Redirecionar após login bem-sucedido
      router.push('/admin/dashboard');
    } catch (error) {
      const pbError = error as PocketBaseError;

      // Mensagem genérica de erro no formulário
      form.setError('email', { message: pbError?.message || 'E-mail ou senha inválidos.' });
      form.setError('password', { message: 'Por favor, verifique suas credenciais.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Insira seu e-mail e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Insira sua senha"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="link" className="w-full">
            Esqueceu sua senha?
          </Button>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Button variant="link" className="p-0">
              Cadastre-se
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
