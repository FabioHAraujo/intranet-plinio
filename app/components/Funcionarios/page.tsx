import Image from "next/image"

import imagem from '@/assets/teste.jpeg'

export default function Funcionarios(){
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(32)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col items-center justify-center space-y-2">
                <Image
                  className="rounded-full bg-muted dark:brightness-[0.8]"
                  src={imagem}
                  alt={`Funcionário ${i + 1}`}
                  width={96}
                  height={96}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
                <h3 className="text-lg font-semibold">Funcionário {i + 1}</h3>
                <p className="text-sm text-muted-foreground">Aqui vai a info do funcionário.</p>
              </div>
            </div>
          ))}
        </div>
    );
}