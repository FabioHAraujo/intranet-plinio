'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Interface para o tipo de dados do menu
interface MenuData {
  id: number,
  main: string,
  side: string,
  salad: string,
  dessert: string,
  special: string
}

// Dados de amostra para o cardápio
const menuData: MenuData[] = [
  { // Segunda-feira
    id: 1,
    main: "Frango Grelhado com Ervas",
    side: "Arroz Integral",
    salad: "Salada Mista",
    dessert: "Frutas Frescas",
    special: "Risoto de Cogumelos"
  },
  { // Terça-feira
    id: 2,
    main: "Peixe ao Molho de Limão",
    side: "Purê de Batatas",
    salad: "Salada de Rúcula",
    dessert: "Pudim de Leite",
    special: "Moqueca de Peixe"
  },
  { // Quarta-feira
    id: 3,
    main: "Bife à Parmegiana",
    side: "Espaguete ao Alho e Óleo",
    salad: "Salada Caesar",
    dessert: "Mousse de Chocolate",
    special: "Lasanha de Berinjela"
  },
  { // Quinta-feira
    id: 4,
    main: "Feijoada Leve",
    side: "Farofa",
    salad: "Couve Refogada",
    dessert: "Laranja",
    special: "Bobó de Camarão"
  },
  { // Sexta-feira
    id: 5,
    main: "Lasanha de Berinjela",
    side: "Arroz Branco",
    salad: "Salada Caprese",
    dessert: "Torta de Limão",
    special: "Paella Vegetariana"
  }
]

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function Cardapio() {
  const [currentDay, setCurrentDay] = useState<number>(0)

  useEffect(() => {
    const now = new Date()
    setCurrentDay(now.getDay())
  }, [])

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cardápio da Semana</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {menuData.map((day) => {
          if (day.id >= currentDay) { // Mostrar apenas os dias a partir do atual
            return (
              <Card key={day.id} className={`${day.id === currentDay ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-center">{weekDays[day.id]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">Prato Principal:</p>
                    <p>{day.main}</p>
                    <p className="font-semibold">Acompanhamento:</p>
                    <p>{day.side}</p>
                    <p className="font-semibold">Salada:</p>
                    <p>{day.salad}</p>
                    <p className="font-semibold">Sobremesa:</p>
                    <p>{day.dessert}</p>
                    <Separator className="my-4" />
                    <p className="font-semibold text-primary">Almoço Especial:</p>
                    <p>{day.special}</p>
                  </div>
                </CardContent>
              </Card>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
