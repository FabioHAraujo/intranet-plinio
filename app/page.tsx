'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { House, Phone, PartyPopper, HelpCircle, UtensilsCrossed, Menu, Moon, Sun, UsersRound, ChevronRight, Cake, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'

// Páginas
import Home from './components/Home/page'
import Funcionarios from './components/Funcionarios/page'
import RamalList from './components/Ramais/page'
import Cardapio from './components/Cardapio/page'
import QuillEditor from './components/QuillEditor/page'

import logo from '@/assets/logo.png'

export default function Component() {
  const [pagina, setPagina] = useState('Home')
  const [theme, setTheme] = useState('light')
  const [funcionariosExpanded, setFuncionariosExpanded] = useState(false)
  const [content, setContent] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const toggleFuncionarios = () => {
    setFuncionariosExpanded(!funcionariosExpanded)
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Image
            src={logo}
            alt="Logo Plínio Fleck"
            width={56}
            height={56}
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
          <Link href="#" onClick={() => setPagina('Home')}>
            <h1 className="text-lg font-semibold p-4">Grupo Plínio Fleck</h1>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" variant="ghost" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button size="icon" variant="ghost">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-muted hidden md:block overflow-y-auto border-r">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="#"
              onClick={() => setPagina('Home')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <House className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="#"
              onClick={() => setPagina('Ramais')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <Phone className="h-4 w-4" />
              Ramais
            </Link>
            <Link
              href="#"
              onClick={() => setPagina('Cardapio')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Cardápio
            </Link>
            <Link
              href="#"
              onClick={() => setPagina('Eventos')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <PartyPopper className="h-4 w-4" />
              Eventos
            </Link>
            <div className="flex flex-col">
              <button
                onClick={toggleFuncionarios}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4" />
                  Homenagens
                </div>
                <motion.div
                  animate={{ rotate: funcionariosExpanded ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {funcionariosExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 flex flex-col gap-2 overflow-hidden"
                  >
                    <Separator />
                    <Link
                      href="#"
                      onClick={() => setPagina('Funcionarios')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <UsersRound className="h-4 w-4" />
                        Tempo de Empresa
                      </div>
                    </Link>
                    <Link
                      href="#"
                      onClick={() => setPagina('NovoFuncionario')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <Cake className="h-4 w-4" />
                        Aniversariantes
                      </div>
                    </Link>
                    <Link
                      href="#"
                      onClick={() => setPagina('RelatoriosFuncionarios')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <GraduationCap className="h-4 w-4" />
                        Formandos
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
          <Button variant="destructive" className="absolute align-bottom left-4 bottom-4 w-56 hover:bg-red-900">Denuncie um Abuso</Button>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {pagina === 'Home' && <Home />}
          {pagina === 'Ramais' && <RamalList />}
          {pagina === 'Cardapio' && <Cardapio />}
          {pagina === 'Funcionarios' && <Funcionarios />}
          {pagina === 'Eventos' && <QuillEditor  value={content} onChange={setContent} />}
          {pagina === 'NovoFuncionario' && <div>Página de Aniversariantes que ainda não existe</div>}
          {pagina === 'RelatoriosFuncionarios' && <div>Página de Formandos que ainda não existe</div>}
        </main>
      </div>
    </div>
  );
}