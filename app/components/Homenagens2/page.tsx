import HomenagemCard from "./HomenagemCard";

export default function Homenagens2() {
  const homenagens = [
    {
      image: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      name: "Maria Silva",
      subtitle: "Contribuições excepcionais na comunidade",
      badgeText: "Evento Especial",
    },
    {
      image: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      name: "Equipe XYZ",
      subtitle: "Alcançaram uma meta de impacto",
      badgeText: "Reconhecimento",
    },
    // Adicione mais homenagens conforme necessário
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Homenagens</h1>
      <p className="text-lg mb-8">
        Confira as homenagens para pessoas e equipes que fizeram a diferença.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {homenagens.map((homenagem, index) => (
          <HomenagemCard
            key={index}
            image={homenagem.image}
            name={homenagem.name}
            subtitle={homenagem.subtitle}
            badgeText={homenagem.badgeText}
          />
        ))}
      </div>
    </div>
  );
}
