'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { House, Phone, PartyPopper, HelpCircle, UtensilsCrossed, Menu, Moon, Sun, UsersRound } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Páginas
import Home from './components/Home/page'
import Funcionarios from './components/Funcionarios/page'
import RamalList from './components/Ramais/page'
import Cardapio from './components/Cardapio/page'
import HeroWithPhotoList from './components/Homenageados/page'

import logo from '@/assets/logo.png'

export default function Component() {
  const [pagina, setPagina] = useState('Home')
  const [theme, setTheme] = useState('light')

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
            <form className="hidden md:block">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] lg:w-[300px]"
              />
            </form>
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
              onClick={() => setPagina('Funcionarios')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <UsersRound className="h-4 w-4" />
              Funcionários
            </Link>
            <Link
              href="#"
              onClick={() => setPagina('Homenagens')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              <PartyPopper className="h-4 w-4" />
              Homenagens
            </Link>
          </nav>
          <Button variant="destructive" className="absolute align-bottom left-4 bottom-4 w-56 hover:bg-red-900">Denuncie um Abuso</Button>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {pagina==='Home' && <Home />}
          {pagina==='Ramais' && <RamalList />}
          {pagina==='Cardapio' && <Cardapio />}
          {pagina==='Funcionarios' && <Funcionarios />}
          {pagina==='Homenagens' && <HeroWithPhotoList />}
        </main>
      </div>
    </div>
  );
}