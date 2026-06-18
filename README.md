# Refund (Fullstack)

Sistema de **solicitação de reembolso** com autenticação (JWT), upload de comprovante e painel por perfil.

- **Employee (funcionário)**: cria solicitações e faz upload.
- **Manager (gerente)**: lista solicitações e visualiza detalhes.

---

## Visão geral do fluxo

1. **Cadastro**
   - O cadastro é `POST /users`.
   - O usuário escolhe um perfil (no backend, role é `employee` ou `manager`, padrão `employee`).

2. **Login**
   - `POST /sessions` retorna um **JWT** e o usuário.
   - O frontend grava no **localStorage** e atualiza o header `Authorization` nas requisições.

3. **Employee enviar reembolso**
   - Tela **Refund** (criar):
     - Envia o arquivo: `POST /uploads` (campo `file`).
     - Cria o pedido: `POST /refunds` com `name`, `category`, `amount` e `filename`.
   - Após enviar, vai para a tela **Confirm**.

4. **Manager listar e visualizar**
   - Tela **Dashboard** lista reembolsos (com paginação):
     - `GET /refunds?name=...&page=...&perPage=...`
   - Ao clicar em um item abre: `GET /refunds/:id`.

---

## Tecnologias

### Frontend
- **React** + **React Router**
- **Vite** (build/serve)
- **Tailwind CSS**
- **Axios** (com baseURL `http://localhost:3333`)
- **Zod** (validação)

### Backend
- **Node.js + Express**
- **JWT** (`jsonwebtoken`)
- **Prisma** + **SQLite**
- **Multer** (upload)
- **Zod** (validação)

---

## Requisitos

- Node.js (recomendado 18+)
- npm
- Portas:
  - Backend: `http://localhost:3333`
  - Frontend (Vite): porta padrão 5173 (ou a que o Vite indicar)

---

## Como rodar localmente

> O repositório está dividido em:
> - `web/` (frontend)
> - `fullstack_refund_api-main/` (backend)

### 1) Rodar o backend (API)

1. Entre na pasta do backend:
   ```bash
   cd fullstack_refund_api-main
   ```

2. Instale dependências:
   ```bash
   npm install
   ```

3. Suba o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Garanta que a API está acessível em:
   - `http://localhost:3333`

> Observação: o upload é servido em `/uploads`:
> - `GET http://localhost:3333/uploads/<filename>` (via `express.static`)

### 2) Rodar o frontend (Web)

1. Entre na pasta do frontend:
   ```bash
   cd web
   ```

2. Instale dependências:
   ```bashn   npm install
   ```

3. Rode o modo dev:
   ```bash
   npm run dev
   ```

4. Abra o navegador no endereço que o Vite mostrar (geralmente http://localhost:5173).

---

## Endpoints esperados da API

Base: `http://localhost:3333`

### Autenticação / Usuários (públicas)

- **Criar usuário**
  - `POST /users`
  - Body (JSON):
    - `name: string`
    - `email: string`
    - `password: string`
    - `role: 'employee' | 'manager'` (opcional; default `employee`)

- **Login**
  - `POST /sessions`
  - Body:
    - `email: string`
    - `password: string`
  - Retorno:
    - `{ token, user }` (user sem a senha)

### Upload de comprovante (privada - employee)

- **Enviar arquivo**
  - `POST /uploads`
  - Headers: `Authorization: Bearer <token>`
  - Multipart/form-data:
    - `file: <arquivo>`
  - Retorno:
    - `{ filename }`

### Reembolsos (privadas)

- **Criar reembolso**
  - `POST /refunds` (employee)
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON):
    - `name: string`
    - `category: 'food' | 'services' | 'transport' | 'accommodation' | 'others'`
    - `amount: number`
    - `filename: string`

- **Listar reembolsos**
  - `GET /refunds` (manager)
  - Headers: `Authorization: Bearer <token>`
  - Query:
    - `name?: string` (filtro por nome)
    - `page?: number` (default 1)
    - `perPage?: number` (default 10)

- **Ver detalhes**
  - `GET /refunds/:id` (employee ou manager)
  - Headers: `Authorization: Bearer <token>`
  - `:id` deve ser UUID.

---

## Rotas do Frontend (React)

A escolha do “layout” e das rotas depende do **role** no `session.user.role` (vindo do JWT).

- `/` e `/signup`:
  - `AuthRoutes` (layout de login/cadastro)

- Employee (`role === 'employee'`):
  - `/` → lista/primeira tela de reembolsos (Dashboard)
  - `/confirm` → mensagem de envio (Confirm)

- Manager (`role === 'manager'`):
  - `/` → Dashboard
  - `/refund/:id` → página Refund buscando detalhes

---

## Autenticação no Frontend (localStorage)

No `AuthContext`:
- Chaves no localStorage:
  - `@refund:user` (JSON do user)
  - `@refund:token` (string JWT)
- Ao salvar:
  - o frontend injeta o header global no Axios:
    - `api.defaults.headers.common["Authorization"] = `Bearer ${token}``

Ao sair (`logout`):
- remove as chaves do localStorage e redireciona para `/`.

---

## Como usar (exemplo)

1. Abra o frontend.
2. Faça login com um usuário de **employee**.
3. Na tela de reembolso:
   - Preencha `Nome`, `Categoria`, `Valor`.
   - Envie um comprovante.
   - Clique em **Enviar**.
4. Você será direcionado para `/confirm`.

Para ver listagem:
1. Faça login com um usuário de **manager**.
2. Acesse a Dashboard e clique em um item para abrir `/refund/:id`.

---

## Observações e possíveis ajustes

- O frontend está configurado para buscar API em `http://localhost:3333`.
- Upload no backend salva arquivos em uma pasta temporária (config via `UPLOADS_FOLDER`).
- O role no backend limita endpoints:
  - `/uploads` e `POST /refunds` exigem **employee**.
  - `GET /refunds` exige **manager**.

---

## FAQ (Troubleshooting)

### “Não conecta” / erro de CORS
- Verifique se o backend está rodando em `http://localhost:3333`.
- CORS já está habilitado no backend com `app.use(cors())`.

### “Unauthorized (401)”
- Confira se o token JWT existe no localStorage (`@refund:token`).
- Garanta que o usuário tem o **role correto** para o endpoint.

