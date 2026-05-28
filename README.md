# SkillUpMind - Avaliação de Alunos de TI

Aplicação Next.js para avaliação inicial de prontidão para TI, com área pública sem login e área administrativa protegida.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Flow
- Recharts
- Storage local em JSON, com camada preparada para Vercel Blob

## Avaliação v3

- 42 perguntas conceituais, situacionais, visuais e psicométricas operacionais.
- Alternativas embaralhadas por tentativa, com correção por `value`.
- Escalas diretas foram substituídas por dilemas bilaterais/SJT, sem indicar que "10" é melhor.
- Cada pergunta é cronometrada e o tempo gasto entra na pontuação.
- Perguntas abertas exigem evidência, ação e relação com o cenário; respostas sem sentido ou genéricas recebem nota baixa e não ganham bônus de tempo.
- Cada email pode ter apenas uma avaliação ativa.
- O admin pode arquivar/desarquivar/apagar avaliações; avaliações arquivadas liberam o email para refazer.
- O aluno vê apenas a confirmação de envio.
- Resultado, notas, relatório, respostas, ranking e mind map são visíveis somente no admin.

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev
```

Acesse:

- Avaliação pública: `http://localhost:3000`
- Login admin: `http://localhost:3000/admin/login`
- Dashboard admin: `http://localhost:3000/admin`

Credenciais padrão:

```txt
usuário: admin
senha: admin
```

Variáveis opcionais:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=admin
ADMIN_SESSION_TOKEN=troque-este-token
BLOB_READ_WRITE_TOKEN=token-do-vercel-blob
BLOB_STORE_ID=id-do-vercel-blob
```

## Storage

Em desenvolvimento, cada avaliação é salva como um JSON individual em:

```txt
data/results
```

Em produção, se `NODE_ENV=production` e uma configuração de Vercel Blob estiver definida, o app usa `VercelBlobStorageProvider`.

O app aceita tanto as variáveis padrão:

```env
BLOB_READ_WRITE_TOKEN=
BLOB_STORE_ID=
```

quanto as variáveis criadas com prefixo customizado na Vercel:

```env
SKILLUPMIND_BLOB_READ_WRITE_TOKEN=
SKILLUPMIND_BLOB_STORE_ID=
```

Quando os dois formatos existem, o app prefere `SKILLUPMIND_BLOB_*`.

Os arquivos locais em `data/results/*.json` são ignorados pelo Git para evitar publicação acidental de dados de alunos.

## Publicação na Vercel

1. Suba o projeto para um repositório GitHub.
2. Na Vercel, importe o repositório.
3. Configure as variáveis de ambiente:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=troque-a-senha
ADMIN_SESSION_TOKEN=valor-longo-e-aleatorio
BLOB_READ_WRITE_TOKEN=token-do-vercel-blob
BLOB_STORE_ID=id-do-vercel-blob
```

4. Crie/conecte um Vercel Blob Store ao projeto. Se a Vercel criar variáveis com prefixo customizado, como `SKILLUPMIND_BLOB_READ_WRITE_TOKEN` e `SKILLUPMIND_BLOB_STORE_ID`, não é necessário renomear.
5. Faça o deploy.

## Verificação

```bash
npm run lint
npm run build
```
