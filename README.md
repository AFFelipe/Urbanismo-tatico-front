# Urbanismo Tático — App 📱

Aplicativo mobile desenvolvido em **React Native com Expo** para monitoramento de intervenções urbanas temporárias em Recife. O cidadão pode visualizar os pontos de intervenção ordenados por proximidade, acompanhar sua localização em tempo real com detecção por geofencing e registrar presença com avaliação por estrelas.

---

## 🚀 Funcionalidades

- **Lista por proximidade** — intervenções ordenadas pela distância do usuário via fórmula de Haversine
- **Geolocalização em tempo real** — rastreamento contínuo com `watchPositionAsync` (atualiza a cada 5s ou 10m)
- **Geofencing** — detecta automaticamente quando o usuário entra no raio de 50 metros de uma intervenção
- **Mapa com marcadores** — exibe todas as intervenções no mapa via `react-native-maps`
- **Registro de presença** — envia coordenadas, timestamp e avaliação com nota de 1 a 5 estrelas para o backend
- **Integração com Dados Recife** — consome API local que processa o CSV oficial do portal Dados Recife

---

## 🛠 Tecnologias

- [React Native](https://reactnative.dev/) + [Expo SDK 54](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) (Stack Navigator)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- [@expo/vector-icons](https://docs.expo.dev/guides/icons/)

---

## 📋 Pré-requisitos

- Node.js v18+
- App **Expo Go** instalado no smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Backend do projeto rodando na mesma rede local

---

## ⚙️ Instalação e execução

**1. Clone o repositório e instale as dependências:**
```bash
git clone https://github.com/AFFelipe/urbanismo-tatico-app.git
cd urbanismo-tatico-app
npm install
```

**2. Configure o IP do backend:**

Em `screens/HomeScreen.js`, substitua pelo IPv4 da sua máquina na rede local:
```js
const API_BASE = 'http://SEU_IP_LOCAL:3000';
```

> Para descobrir seu IP: `ipconfig` (Windows) ou `ifconfig` (Linux/macOS)

**3. Inicie o projeto:**
```bash
npx expo start
```

Escaneie o QR Code gerado no terminal com o app **Expo Go**.

---

## 📂 Estrutura do projeto
