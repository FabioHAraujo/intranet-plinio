'use client'

import { useState, useEffect } from 'react'
import { useRouter, redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  House, 
  Phone, 
  PartyPopper, 
  HelpCircle, 
  UtensilsCrossed, 
  Menu, 
  Moon, 
  Sun, 
  UsersRound, 
  ChevronRight, 
  Cake, 
  GraduationCap, 
  Newspaper, 
  CalendarHeart 
} from "lucide-react"
import Image from "next/image"
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'

import logo from '@/assets/logo.png'

type LayoutProps = {
  children: React.ReactNode
}

export default function LayoutPadrao({ children }: LayoutProps) {
  const [theme, setTheme] = useState('light')
  const [homenagensExpanded, setHomenagensExpanded] = useState(false)
  const [funcionariosExpanded, setFuncionariosExpanded] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Recuperar tema no localstorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')

    // Recuperar estado dos menus no localstorage
    const homenagensState = localStorage.getItem('homenagensState') === 'true';
    setHomenagensExpanded(homenagensState)
    const funcionariosState = localStorage.getItem('funcionariosState') === 'true';
    setFuncionariosExpanded(funcionariosState)
    console.log(homenagensState, funcionariosState)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const toggleFuncionarios = () => {
    const newState = !funcionariosExpanded;
    setFuncionariosExpanded(newState);
    localStorage.setItem("funcionariosState", String(newState)); // Converte booleano para string
  };
  
  const toggleHomenagens = () => {
    const newState = !homenagensExpanded;
    setHomenagensExpanded(newState);
    localStorage.setItem("homenagensState", String(newState)); // Converte booleano para string
  };

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
          <h1 className="text-lg font-semibold p-4 cursor-pointer" onClick={() => router.push('/')}>
            Grupo Plínio Fleck
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="destructive" className="left-4 bottom-4 w-56 hover:bg-red-900" onClick={() => router.push('/denuncia')}>
              Denuncie um Abuso
            </Button>
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
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <House className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => redirect('/ramais')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <Phone className="h-4 w-4" />
              Ramais
            </button>
            <button
              onClick={() => redirect('/cardapio')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Cardápio
            </button>
            <button
              onClick={() => router.push('/noticias')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <Newspaper className="h-4 w-4" />
              Notícias
            </button>
            <div className="flex flex-col">
              <button
                onClick={toggleHomenagens}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4" />
                  Homenagens
                </div>
                <motion.div
                  animate={{ rotate: homenagensExpanded ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {homenagensExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 flex flex-col gap-2 overflow-hidden"
                  >
                    <Separator />
                    <button
                      onClick={() => router.push('/anos-conosco')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <UsersRound className="h-4 w-4" />
                        Anos Conosco
                      </div>
                    </button>
                    <button
                      onClick={() => router.push('/formandos')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <GraduationCap className="h-4 w-4" />
                        Formandos
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col">
              <button
                onClick={toggleFuncionarios}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Cake className="h-4 w-4" />
                  Datas Comemorativas
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
                    <button
                      onClick={() => router.push('/tempo-de-empresa')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <UsersRound className="h-4 w-4" />
                        Tempo de Empresa
                      </div>
                    </button>
                    <button
                      onClick={() => router.push('/aniversariantes')}
                      className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                    >
                      <div className='flex items-center gap-2'>
                        <CalendarHeart className="h-4 w-4" />
                        Aniversariantes
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
