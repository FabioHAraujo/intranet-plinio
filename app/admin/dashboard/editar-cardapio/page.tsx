'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import PocketBase from "pocketbase";

interface MenuData {
  id: string;
  date: string;
  main: string;
  special: string;
}

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function Cardapio() {
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [editNormalText, setEditNormalText] = useState('');
  const [editSpecialText, setEditSpecialText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const today = new Date();
        const records = await pb.collection("cardapios").getFullList<MenuData>({
          filter: `date >= "${today.toISOString().split("T")[0]}"`,
          sort: "date",
        });
        setMenuData(records);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar cardápio:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("cardapios").delete(id);
      setMenuData((prev) => prev.filter((menu) => menu.id !== id));
      alert("Cardápio excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cardápio:", error);
      alert("Erro ao excluir o cardápio.");
    }
  };

  const handleEditSave = async () => {
    if (!selectedMenu) return;

    try {
      setIsSubmitting(true);

      await pb.collection("cardapios").update(selectedMenu.id, {
        main: editNormalText,
        special: editSpecialText,
      });

      setMenuData((prev) =>
        prev.map((menu) =>
          menu.id === selectedMenu.id ? { ...menu, main: editNormalText, special: editSpecialText } : menu
        )
      );

      alert("Cardápio atualizado com sucesso!");
      setSelectedMenu(null);
    } catch (error) {
      console.error("Erro ao editar cardápio:", error);
      alert("Erro ao editar o cardápio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cardápio da Semana</h1>
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {menuData.map((day) => {
            const dayDate = new Date(day.date);
            const dayName = weekDays[dayDate.getDay()];

            return (
              <Card key={day.id}>
                <CardHeader>
                  <CardTitle className="text-center">
                    {dayName} - {dayDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">Almoço Normal:</p>
                    <div className="whitespace-pre-wrap">{day.main}</div>
                    <Separator className="my-4" />
                    <p className="font-semibold text-primary">Almoço Especial:</p>
                    <div className="whitespace-pre-wrap">{day.special}</div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMenu(day);
                            setEditNormalText(day.main);
                            setEditSpecialText(day.special);
                            setIsEditDialogOpen(true); // Abre o diálogo
                          }}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Cardápio</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <label className="block font-semibold">Almoço Normal:</label>
                          <Textarea
                            value={editNormalText}
                            onChange={(e) => setEditNormalText(e.target.value)}
                          />
                          <label className="block font-semibold">Almoço Especial:</label>
                          <Textarea
                            value={editSpecialText}
                            onChange={(e) => setEditSpecialText(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={async () => {
                              await handleEditSave();
                              setIsEditDialogOpen(false); // Fecha o diálogo após salvar
                            }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedMenu(null);
                              setIsEditDialogOpen(false); // Fecha o diálogo ao cancelar
                            }}
                          >
                            Cancelar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(day.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
