'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PocketBase from 'pocketbase';
import { format } from 'date-fns';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default function CadastrarCardapio() {
  const [normalText, setNormalText] = useState('');
  const [specialText, setSpecialText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyBold = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      const boldText = value.replace(selection, `*${selection}*`);
      setter(boldText);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      alert('Por favor, selecione uma data para o cardápio.');
      return;
    }

    try {
      setIsSubmitting(true);

      await pb.collection('cardapios').create({
        date: format(selectedDate, 'yyyy-MM-dd'),
        main: normalText,
        special: specialText,
      });

      alert('Cardápio cadastrado com sucesso!');
      setNormalText('');
      setSpecialText('');
      setSelectedDate(null);
    } catch (error) {
      console.error('Erro ao cadastrar cardápio:', error);
      alert('Erro ao cadastrar o cardápio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cadastrar Cardápio</h1>

      <div className="space-y-4">
        {/* Campo de Almoço Normal */}
        <div>
          <label htmlFor="normalText" className="block font-semibold">
            Almoço Normal:
          </label>
          <Textarea
            id="normalText"
            placeholder="Digite o texto do almoço normal..."
            value={normalText}
            onChange={(e) => setNormalText(e.target.value)}
            className="mt-2"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleApplyBold(setNormalText, normalText)}
            className="mt-2"
          >
            Aplicar Negrito ao Selecionado
          </Button>
        </div>

        {/* Campo de Almoço Especial */}
        <div>
          <label htmlFor="specialText" className="block font-semibold">
            Almoço Especial:
          </label>
          <Textarea
            id="specialText"
            placeholder="Digite o texto do almoço especial..."
            value={specialText}
            onChange={(e) => setSpecialText(e.target.value)}
            className="mt-2"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleApplyBold(setSpecialText, specialText)}
            className="mt-2"
          >
            Aplicar Negrito ao Selecionado
          </Button>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block font-semibold">Data do Cardápio:</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDatePickerOpen(true)}
            className="mt-2 flex items-center"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Selecionar Data'}
          </Button>

          {/* Dialog do Date Picker */}
          <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecione uma data</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="mx-auto"
              />
              <DialogFooter>
                <Button onClick={() => setIsDatePickerOpen(false)}>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Botão de Enviar */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? 'Enviando...' : 'Cadastrar Cardápio'}
        </Button>
      </div>
    </div>
  );
}
