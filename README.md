Urbanismo Tático — App 📱
Aplicativo mobile desenvolvido em React Native com Expo para auxiliar no monitoramento e validação de intervenções urbanas temporárias. O sistema permite que o cidadão visualize locais de intervenção, acompanhe sua distância em tempo real e registre sua presença, servindo como uma ferramenta de coleta de dados para gestão urbana inteligente.

🚀 Funcionalidades Principais
Geolocalização em tempo real: Utiliza o expo-location para capturar a posição do usuário.

Cálculo de Proximidade: Implementação da fórmula de Haversine para calcular a distância entre o usuário e as intervenções.

Validação Participativa: Registro de presença via requisição POST com captura de coordenadas e timestamp.

Navegação Dinâmica: Fluxo de telas otimizado com React Navigation (Stack).

🛠 Pré-requisitos
Certifique-se de ter instalado:

Node.js (v18 ou superior)

Expo Go (disponível na Play Store/App Store)

⚙️ Instalação e Execução
Clone o repositório e instale as dependências:

Bash
npm install
Configure o Servidor:
O app consome uma API local. Certifique-se de que o backend esteja rodando no seu computador e altere o IP em screens/HomeScreen.js para o IP da sua rede local (IPv4):

JavaScript
const API_BASE = 'http://192.168.x.x:3000';
Inicie o projeto:

Bash
npx expo start
Utilize o app Expo Go no seu smartphone para escanear o QR Code gerado no terminal.

📂 Estrutura do Projeto
App.js: Configuração do Navigation Container e rotas.

/screens/HomeScreen.js: Hub principal. Responsável pelo fetch dos dados, cálculo de distância (Haversine) e ordenação por proximidade.

/screens/TrackingScreen.js: Interface de monitoramento contínuo, utilizando watchPositionAsync para atualizar a posição do usuário.

📡 Documentação da API (Backend)
O aplicativo integra-se com um servidor Node.js/FastAPI através dos seguintes endpoints:

GET /intervencoes: Retorna o JSON com as intervenções cadastradas.

POST /registro-posicao: Envia um JSON com:

JSON
{
  "latitude": -8.05,
  "longitude": -34.88,
  "rua_nome": "Exemplo",
  "timestamp": "2026-06-23T..."
}
🎓 Contexto Acadêmico
Este projeto é uma aplicação prática de Urbanismo Tático baseado em dados (Data-Driven), onde a tecnologia atua como ponte entre a intervenção física no espaço público e a mensuração do engajamento do cidadão.