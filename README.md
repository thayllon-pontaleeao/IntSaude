#  IntSaúde
 
Aplicativo mobile para localização de unidades de saúde pública (SUS) em Brasília, desenvolvido como projeto acadêmico da disciplina de **Progamção de app** — Universidade Católica de Brasília (UCB).
 
**Grupo 3:** Arthur Machado · Italo · Samuel Rodrigues · Thayllon Pontaleeao
 
---
 
##  Sobre o Projeto
 
O **IntSaúde** permite que cidadãos de Brasília localizem unidades do SUS próximas a eles com base em GPS, consultem a ocupação em tempo real, recebam sugestões de exames a partir de sintomas e acessem um painel administrativo para gerenciamento das unidades.
 
### Funcionalidades principais
 
-  Autenticação multi-perfil (paciente / administrador)
-  Localização de unidades via GPS (Leaflet + WebView)
-  Visualização de ocupação em tempo real
-  Sugestão de exames baseada em sintomas
-  Painel administrativo para gestão das unidades
---
 
##  Tecnologias
 
| Tecnologia | Versão |
|v1.0|---|
| React Native | 0.74+ |
| Expo | ~51 |
| TypeScript | 5.x |
| React Navigation | 6.x |
| expo-location | latest |
| AsyncStorage | latest |
| react-native-webview | latest |
| Leaflet.js | (via WebView) |
 
---
 
##  Pré-requisitos
 
Antes de começar, certifique-se de ter instalado:
 
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
> **Windows:** recomenda-se usar o PowerShell ou Terminal do VS Code.
 
---
 
##  Como executar o projeto
 
### 1. Clone o repositório
 
```bash
git clone https://github.com/thayllon-pontaleeao/IntSaude.git
cd IntSaude
```
 
### 2. Instale as dependências
 
```bash
npm install
```
 
### 3. Inicie o servidor de desenvolvimento
 
```bash
npx expo start
```
 
### 4. Abra no celular
 
- Abra o **Expo Go** no seu celular
- Escaneie o **QR Code** exibido no terminal
- O app será carregado automaticamente
>  Certifique-se de que o celular e o computador estão na **mesma rede Wi-Fi**.
 
---
 
##  Estrutura do Projeto
 
```
IntSaude/
├── src/
│   ├── screens/          # Telas do aplicativo
│   ├── components/       # Componentes reutilizáveis
│   ├── navigation/       # Configuração de rotas (React Navigation)
│   ├── services/         # Lógica de negócio e chamadas de API
│   └── assets/           # Imagens e recursos estáticos
├── app.json              # Configurações do Expo
├── tsconfig.json         # Configurações do TypeScript
└── package.json          # Dependências do projeto
```
 
---
 
##  Perfis de Acesso
 
| Perfil | Acesso |
|---|---|
| **Paciente** | Localizar unidades, ver ocupação, sugestão de exames |
| **Administrador** | Painel de gestão das unidades de saúde |
 
---
 
##  Solução de Problemas
 
**Erro ao instalar dependências:**
```bash
npm install --legacy-peer-deps
```
 
**Expo não encontra o dispositivo:**
- Verifique se estão na mesma rede Wi-Fi
- Tente usar o modo túnel: `npx expo start --tunnel`
**Limpar cache do Expo:**
```bash
npx expo start -c
```
 
---
 
##  Entregas Acadêmicas
 
| Branch | Descrição | Data |
|---|---|---|
| `entrega/n1-entrega-atual` | Entrega atual do projeto | 08/05/2025 |
| `entrega/n2-entrega-2` | Persistência local + Animações | 20/05/2025 |
 
---
 
## Licença
 
Projeto acadêmico desenvolvido para fins educacionais — UCB, 2025.