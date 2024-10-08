// components/Homenageados/page.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Homenagens = () => {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="formandos" className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <AccordionTrigger>Formandos</AccordionTrigger>
          <AccordionContent>
            <p>Aqui você pode listar os formandos do mês ou ano.</p>
            {/* Adicione a lógica e os dados dos formandos aqui */}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tempo-de-empresa" className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <AccordionTrigger>Tempo de Empresa</AccordionTrigger>
          <AccordionContent>
            <p>Aqui você pode listar os funcionários com mais tempo na empresa.</p>
            {/* Adicione a lógica e os dados de tempo de empresa aqui */}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="aniversariantes" className="rounded-lg border bg-card text-card-foreground shadow-sm !duration-500">
          <AccordionTrigger>Aniversariantes</AccordionTrigger>
          <AccordionContent>
            <p>Aqui você pode listar os aniversariantes do mês.</p>
            {/* Adicione a lógica e os dados dos aniversariantes aqui */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Homenagens;
