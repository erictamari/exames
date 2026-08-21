import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const specialties = [
  ["Cardiologia", "cardiologia", "❤️"],
  ["Gastroenterologia", "gastroenterologia", "🩺"],
  ["Oftalmologia", "oftalmologia", "👁️"],
  ["Infectologia", "infectologia", "🦠"],
  ["Endocrinologia", "endocrinologia", "🧬"],
  ["Dermatologia", "dermatologia", "✨"],
  ["Ortopedia", "ortopedia", "🦴"],
  ["Neurologia", "neurologia", "🧠"],
  ["Ginecologia", "ginecologia", "🌸"],
  ["Urologia", "urologia", "💧"],
  ["Otorrinolaringologia", "otorrinolaringologia", "👂"],
  ["Pneumologia", "pneumologia", "🫁"],
  ["Nefrologia", "nefrologia", "🫘"],
  ["Reumatologia", "reumatologia", "🦵"],
  ["Psiquiatria", "psiquiatria", "💬"],
  ["Clínica Geral", "clinica-geral", "➕"],
  ["Odontologia", "odontologia", "🦷"]
] as const;

async function main() {
  for (const [name, slug, icon] of specialties) {
    await prisma.specialty.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        icon,
        improvement: "Registre aqui os pontos que você deseja melhorar, conforme orientação profissional.",
        actions: "Registre aqui exames, hábitos e ações recomendadas pelo seu profissional de saúde.",
        medications: "Registre somente medicamentos/condutas já orientados por um profissional."
      }
    });
  }

  const cardio = await prisma.specialty.findUnique({ where: { slug: "cardiologia" } });
  if (cardio) {
    await prisma.appointment.create({
      data: {
        specialtyId: cardio.id,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
        doctor: "Exemplo — substitua pelo nome",
        location: "Clínica",
        notes: "Consulta de acompanhamento"
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
