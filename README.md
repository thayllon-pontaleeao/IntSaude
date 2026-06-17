# intSaúde

Aplicativo mobile para localização e consulta de unidades de saúde do SUS no Distrito Federal, desenvolvido com React Native, Expo e backend Node.js.

## Integrantes

| Nome | Matrícula | Atribuições |
|------|-----------|-------------|
| Arthur Machado | UC24101996 | Telas de HomeScreen, HospitalDetailScreen e AnamneseScreen |
| Samuel Rodrigues | UC2410123 | Telas de GestorPanelScreen, SuperAdminDashboard e AdminScreens |
| Thayllon Pontaleeao | UC24101708 | Arquitetura do projeto, AuthContext, MapScreen, backend Node.js e banco de dados SQLite |

---

## Sobre o Projeto

O intSaúde permite que cidadãos encontrem hospitais, UBSs e UPAs próximos no Distrito Federal, consultem informações sobre as unidades e acessem serviços de saúde pública de forma rápida e intuitiva. O sistema conta com backend próprio em Node.js com autenticação JWT e banco de dados SQLite.

> Projeto acadêmico desenvolvido para a disciplina de Mobile I — UCB 2026.

---

## Funcionalidades

- Autenticação de usuários com JWT (cadastro, login e recuperação de senha)
- Listagem e busca de unidades de saúde do DF
- Mapa interativo com 16 unidades reais georeferenciadas
- Perfis de acesso: paciente, gestor, supervisor e admin
- Painel administrativo para gestores e supervisores
- Anamnese digital com sugestão de unidade
- Backend REST API com Node.js e Express
- Banco de dados SQLite com cadastro persistido

---

## Tecnologias

### Frontend (App)
- [React Native](https://reactnative.dev/) 0.81.5
- [Expo](https://expo.dev/) SDK 54
- [TypeScript](https://www.typescriptlang.org/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) ~16.0.10
- [React Navigation](https://reactnavigation.org/) 6
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [Axios](https://axios-http.com/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### Backend
- [Node.js](https://nodejs.org/) v24+
- [Express](https://expressjs.com/) 5.1.0
- [SQLite3](https://www.npmjs.com/package/sqlite3)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenvx](https://dotenvx.com/)
- [cors](https://www.npmjs.com/package/cors)
- [nodemon](https://nodemon.io/)

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) instalado no celular
- Celular e computador na **mesma rede Wi-Fi**

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/thayllon-pontaleeao/IntSaude.git
cd IntSaude
```

### 2. Instale as dependências do app

```bash
npm install
```

### 3. Configure e inicie o backend

```bash
cd intsaude-backend
npm install
```

Crie o arquivo `.env` dentro de `intsaude-backend/`:

```env
PORT=3000
JWT_SECRET=intsaude_secret_super_seguro
```

Descubra o IP da sua máquina:

```bash
# Windows
ipconfig
# Procure: Endereço IPv4 (ex: 192.168.1.14)

# Mac/Linux
ifconfig
```

Atualize o IP em `src/services/api.ts`:

```ts
baseURL: 'http://SEU_IP:3000',
```

Inicie o backend:

```bash
npm run dev
```

O banco `intsaude.db` será criado automaticamente com as 16 unidades de saúde do DF.

### 4. Inicie o app

Em outro terminal, na raiz do projeto:

```bash
npx expo start
```

Escaneie o QR code com o Expo Go no celular.

---

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /auth/login | Autentica usuário e retorna JWT | Não |
| POST | /auth/cadastro | Cadastra novo usuário | Não |
| GET | /unidades | Lista todas as unidades | Sim |
| GET | /unidades/buscar?tipo=UPA | Filtra unidades por tipo | Sim |
| GET | /unidades/:id | Retorna unidade por ID | Sim |

---

## Acessos Demo

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Administrador | admin@sus.gov.br | 1234 |
| Gestor | gestor@sus.gov.br | 1234 |
| Supervisor | supervisor@sus.gov.br | 1234 |
| Paciente | Cadastro via app | — |

---

## Estrutura do Projeto

```
IntSaude/
├── intsaude-backend/              # Backend Node.js
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.js              # Conexão e criação das tabelas SQLite
│   │   │   └── seed.js            # Popular banco com unidades de saúde
│   │   ├── data/
│   │   │   └── unidades.js        # 16 unidades reais do DF
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js  # Validação JWT
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Login e cadastro
│   │   │   └── unidadesRoutes.js  # CRUD de unidades
│   │   └── app.js                 # Entrada da aplicação
│   ├── .gitignore
│   └── package.json
├── src/
│   ├── context/
│   │   └── AuthContext.tsx        # Autenticação e sessão
│   ├── data/
│   │   └── mockData.ts            # Dados locais de fallback
│   ├── lib/
│   │   └── database.ts            # SQLite local (expo-sqlite)
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Navegação entre telas
│   ├── screens/
│   │   ├── AuthScreen.tsx         # Login, cadastro e recuperação
│   │   ├── HomeScreen.tsx         # Listagem de unidades
│   │   ├── MapScreen.tsx          # Mapa interativo
│   │   ├── HospitalDetailScreen.tsx
│   │   ├── AnamneseScreen.tsx
│   │   ├── PerfilScreen.tsx
│   │   ├── GestorPanelScreen.tsx
│   │   ├── SuperAdminDashboard.tsx
│   │   └── AdminScreens.tsx
│   ├── services/
│   │   ├── api.ts                 # Instância Axios + interceptor JWT
│   │   └── unidadesService.ts     # Funções de acesso à API
│   └── types/
│       └── index.ts
├── App.tsx
├── app.json
├── package.json
└── README.md
```

---

## Repositório

[https://github.com/thayllon-pontaleeao/IntSaude](https://github.com/thayllon-pontaleeao/IntSaude)

---

*intSaúde · Grupo 3 · Mobile I · UCB — 2026 · Brasília, DF · Dados simulados para fins acadêmicos*
