# HEALTH OS

Sistema pessoal de gestão de saúde feito com Next.js + Prisma + SQLite.

## Recursos

- Dashboard inicial com:
  - próxima consulta por especialidade
  - contador de dias
  - última visita
  - agenda
  - indicadores gerais
- Menu lateral com especialidades:
  Cardiologia, Gastroenterologia, Oftalmologia, Infectologia, Endocrinologia,
  Dermatologia, Ortopedia, Neurologia, Ginecologia, Urologia,
  Otorrinolaringologia, Pneumologia, Nefrologia, Reumatologia,
  Psiquiatria, Clínica Geral e Odontologia.
- Histórico de consultas por especialidade.
- Histórico de exames por especialidade.
- Upload de PDF, PNG, JPG/JPEG.
- Página exclusiva de exames de sangue.
- Comparação de resultados atuais com resultados anteriores.
- Área de acompanhamento pessoal por especialidade:
  "O que melhorar", "O que fazer" e "Medicamentos/condutas registradas".
- Busca e organização básica de registros.

## Rodar localmente

Requisitos: Node.js 20+.

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Abra http://localhost:3000

Para popular dados de exemplo:

```bash
npm run db:seed
```

## Uploads

Nesta versão, os arquivos ficam em `uploads/`.
Isso é adequado para desenvolvimento/local. Em produção, troque o armazenamento
por S3, Supabase Storage, Cloudflare R2 ou outro storage persistente.

## Importante

O campo de medicamentos/condutas é um registro pessoal. O sistema não diagnostica
e não prescreve medicamentos. Use-o para registrar orientações dadas por profissionais
de saúde e confirmar qualquer conduta com seu médico.
