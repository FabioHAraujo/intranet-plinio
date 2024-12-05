// app/not-found.js
import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redireciona para a página inicial
  redirect('/');
  return null; // Não renderiza nada
}
