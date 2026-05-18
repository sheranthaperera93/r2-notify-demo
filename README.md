# r2-notify-demo

The official demo application for the R2-Notify real-time notification platform. It serves two purposes — a public-facing landing page that explains the project, and a live playground where you can connect over WebSocket, send test notifications, and see them arrive in real time.

Built with React, Vite, and Tailwind CSS. Uses [`r2-notify-react`](https://www.npmjs.com/package/r2-notify-react) as the notification layer.

🔗 **Live demo:** https://r2-notify-demo.onrender.com

---

## Features

- 🏠 **Landing page** — overview of the R2-Notify platform, architecture, integration examples, and getting started guide
- 🔌 **Playground** — connect to a live r2-notify-server, toggle auto-connect and debug mode, and see real-time WebSocket activity
- 📬 **Send notifications** — fire test notifications directly from the browser via the REST API
- 🔑 **API key management** — register, log in, and manage your API keys
- 🐛 **Debug console** — live WebSocket activity log filtered to r2-notify events
- 🌙 **Dark mode** — system preference detection with manual toggle, persisted to localStorage

---

## Prerequisites

- Node.js 18+
- A running [r2-notify-server](https://github.com/sheranthaperera93/r2-notify-server) instance

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sheranthaperera93/r2-notify-demo.git
cd r2-notify-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
VITE_R2_NOTIFY_SVR=http://localhost:8081
VITE_R2_NOTIF_DEBUG=false
VITE_WS_AUTO_CONNECT=false
VITE_PLAYGROUND_API_KEY=your-api-key-here
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

| Variable                  | Required | Description                                                    |
| ------------------------- | -------- | -------------------------------------------------------------- |
| `VITE_R2_NOTIFY_SVR`      | yes      | Base URL of your r2-notify-server e.g. `http://localhost:8081` |
| `VITE_R2_NOTIF_DEBUG`     | no       | Enable WebSocket debug logging. Default `false`                |
| `VITE_WS_AUTO_CONNECT`    | no       | Auto-connect on app load. Default `false`                      |
| `VITE_PLAYGROUND_API_KEY` | yes      | API key used in the Playground                                 |

> The app derives the WebSocket URL automatically from `VITE_R2_NOTIFY_SVR` — `http` becomes `ws`, `https` becomes `wss`. You only need one URL.

---

## Pages

### `/` — Landing page

An overview of the R2-Notify platform including features, architecture diagram, code integration examples, and a getting started guide.

### `/playground` — Playground

Connect to your r2-notify-server and interact with it in real time.

- **Connection Settings** — toggle auto-connect and debug mode, connect/disconnect manually
- **Send Notification** — fire a test notification to your connected client via the REST API
- **Debug Console** — live log of all `[r2 client]` and `[r2-react]` WebSocket events, with level badges and timestamps. Appears when debug mode is enabled.

### `/api-keys` — Manage API Keys

Create and manage API keys for your account. Requires authentication (register or log in).

### `/api-keys/:keyId` — Key Details

View details and usage for a specific API key.

---

## Project Structure

```
r2-notify-demo/
├── src/
│   ├── App.tsx                          # Root component — R2NotifyProvider wraps the whole app
│   ├── main.tsx                         # Entry point
│   ├── config/
│   │   └── env.ts                       # Typed env var helpers
│   ├── context/
│   │   ├── AuthContext.tsx              # JWT auth state
│   │   └── ThemeContext.tsx             # Dark mode state + toggle
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── PlaygroundPage.tsx
│   │   ├── ManageKeyPage.tsx
│   │   └── KeyDetailPage.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── playground/
│   │   │   ├── ConnectionPanel.tsx      # Connect/disconnect + debug toggle
│   │   │   ├── SendNotificationsPanel.tsx
│   │   │   └── DebugLogPanel.tsx        # Live WebSocket activity console
│   │   ├── notifications/
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── AppAccordion.tsx
│   │   │   ├── GroupAccordion.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── ConfigurationPanel.tsx
│   │   └── manageKey/
│   │       ├── KeyDashboard.tsx
│   │       ├── KeyActions.tsx
│   │       ├── KeyDetails.tsx
│   │       └── ...
│   ├── api/
│   │   └── authClient.ts                # Axios client for auth API calls
│   └── utils/
│       ├── interfaces.ts
│       └── utils.ts
├── public/
├── .env.example
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## How the Notification Connection Works

The `R2NotifyProvider` is mounted at the root of the app in `App.tsx`, wrapping all routes. It receives `serverUrl` and `apiKey` from env, and auto-connects based on `VITE_WS_AUTO_CONNECT`.

On connect, the provider:

1. POSTs the API key to `{serverUrl}/ws-token` — receives a short-lived single-use token
2. Opens a WebSocket to `{serverUrl}/ws?token=<token>`
3. Caches the notification list, new notifications, and config in React state

The API key never appears in a WebSocket URL.

On page refresh or reconnect, the full two-step flow runs again automatically — a fresh token is always fetched.

---

## Available Scripts

| Command           | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `npm run dev`     | Start the Vite development server on `http://localhost:5173` |
| `npm run build`   | Create a production build in `dist/`                         |
| `npm run preview` | Preview the production build locally                         |

---

## Tech Stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| UI framework  | React 18                           |
| Build tool    | Vite                               |
| Styling       | Tailwind CSS                       |
| Icons         | Heroicons                          |
| Routing       | React Router v7                    |
| Notifications | r2-notify-react + r2-notify-client |
| Auth          | JWT via r2-notify-server           |

---

## Related

- **[r2-notify-server](https://github.com/sheranthaperera93/r2-notify-server)** — the Go WebSocket server this app connects to
- **[r2-notify-client](https://www.npmjs.com/package/r2-notify-client)** — framework-agnostic TypeScript client
- **[r2-notify-react](https://www.npmjs.com/package/r2-notify-react)** — React provider and hooks

---

## License

MIT © Sherantha Perera
