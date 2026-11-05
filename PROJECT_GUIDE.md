# Project Guide — Lords Exchange Frontend

Ye file padh kar naya developer samajh sake ki project kya hai, code kahan hai, data kaise aata hai, aur naya kaam kaise karna hai.

> Last updated: 27 Oct 2026

---

## 1. Project kya hai

Ek **betting exchange** (sports + casino) ka frontend. **Ek hi React app** mein teen panel hain:

| Panel | Kis ke liye | URL | Code |
|---|---|---|---|
| **User** | Player — matches dekhna, bet lagana, casino, wallet | `/`, `/exchange/...`, `/casino/...` | `src/user-app/` (naya) + `src/pages/` (purana) |
| **Admin** | Super admin / admin / master — users, matches, reports | `/admin/...` | `src/admin-app/` |
| **Agent** | Agent — apne clients, reports, payments | `/agent/...` | `src/agent-panel/` (pages zyada-tar `admin-app` se import hote hain) |

Backend alag project hai (Node API + Socket.io). Ye repo **sirf frontend** hai.

---

## 2. Tech stack

- **React 18 + TypeScript**, **Create React App** (`react-scripts` 5) — Next.js nahi.
- **Routing:** `react-router-dom` v6 (`useRoutes`).
- **State:** Redux Toolkit (`src/redux/`) + kuch React context.
- **API:** axios (`src/utils/api.ts`), live data **Socket.io** (`src/context/`).
- **Styling:**
  - Purana user/admin UI: Bootstrap + global CSS (`public/css/*.css`), kahin MUI/antd.
  - Naya user UI: **Tailwind CSS v3** (prefix `tw-`) — sirf `src/user-app/` mein.
- **Icons:** `react-icons` (naye code mein `src/user-app/icons.ts` se import karo).
- Font: Lato (naya UI), Roboto Condensed (purana).

---

## 3. Chalana (local)

```bash
npm install --legacy-peer-deps   # peer-deps conflict hai, isliye flag
npm start                        # http://localhost:3000
npm run build                    # production build → build/
```

- `tailwind.config.js` ya `.env` badlo to **dev server restart** karo.
- Node 22 par chal raha hai; CI (Bitbucket) `node:16` image use karta hai.

### Environment (`.env`)

| Variable | Kya hai |
|---|---|
| `REACT_APP_API_BASEURL` | Main backend API (`https://api.jmdbook.online/api/` abhi) |
| `REACT_APP_API_SPORTS_URL`, `REACT_APP_API_SPORTS_FANCY_URL`, `REACT_APP_PYTHON_SERVER` | Sports / fancy data servers |
| `REACT_APP_API_SOCKET_URL` | Odds / markets ka socket |
| `REACT_APP_USER_SOCKET` | User socket (balance, bets, logout) |
| `REACT_APP_CASINO_SOCKET_URL` | Casino socket |
| `REACT_APP_IP_API_URL` | User ka IP (login `logs` mein jaata hai) |
| `REACT_APP_SITE_URL`, `REACT_APP_T10_STREAM`, `REACT_APP_API_KEY` | Misc |

`.env` mein secrets hain — kabhi public mat karo.

---

## 4. Deploy

`bitbucket-pipelines.yml`: **`main` branch par push hote hi** build hota hai aur server ke `public/` folder ko **delete karke** nayi build copy hoti hai. Matlab `main` par push = live. Kaam alag branch par karo.

---

## 5. Folder map

```
src/
├── index.tsx              → Redux Provider + 3 socket providers + App
├── App.tsx                → Router, user info load, socket logout handling
├── routes/index.tsx       → SAARE routes (user + admin + agent yahin jude hain)
│
├── user-app/              → ★ NAYA user panel (redesign) — section 7 dekho
├── pages/                 → PURANA user panel pages (reports, wallet, casino games…)
├── admin-app/             → Admin panel (AdminRoutes.tsx + pages/)
├── agent-panel/           → Agent panel (AgentRoutes.tsx — admin pages reuse)
│
├── services/              → API functions, feature-wise (sports, bet, casino, user, auth…)
├── redux/                 → store + slices (login, balance, sports, casino, bet, common)
├── context/               → Socket providers: webSocket, webSocketUser, webSocketCasino
├── models/                → TypeScript types (IMatch, IMarket, IBet, LFancy, User…)
├── utils/                 → api.ts (axios), helpers, bet-pnl.ts, casino-images.ts, constants
├── components/            → Purane shared components
└── _hooks/                → useDeposit, useWithdraw
```

Root ki `edit_model.js`, `edit_model_fix.js`, `edit_val.js`, `update_fancy.js` — **backend project** ki files badalne wali one-time scripts hain. Is frontend se lena-dena nahi. Mat chalao.

---

## 6. Data flow — API aur state

### 6.1 Teen layer

```
Component / hook
      │  calls
      ▼
services/*.service.ts      ← sirf API call, promise return
      │  uses
      ▼
utils/api.ts (axios)       ← token lagata hai, errors handle karta hai
      │
      ▼
Backend API
```

**`utils/api.ts`:**
- Request interceptor: `Authorization: Bearer <token>` (`localStorage.token`, admin ke liye `token-admin`).
- Response interceptor: `jwt expired` / `jwt malformed` / maintenance → logout + page reload.

### 6.2 Data kahan rakha jaata hai

**Redux** — jo data kai screens share karti hain:

| Slice (`src/redux/actions/…`) | Data | Kaise bharta hai |
|---|---|---|
| `login` | user, status, contacts | `loginAction`, `getUserInfoAction` |
| `balance` | balance, exposure | `getUserBalance`, socket `updateExposer` |
| `sports` | sport list, saare matches, current match | `getSportListAction`, `getMatchListAction` |
| `casino` | apne casino games | `getCasinoList` → `setHomePageCasinoMatch` |
| `bet` | betslip selection (`betPopup`), placeBet status, book/PnL, open bets | `getPlaceBetAction`, `getBets` |
| `common` | loader, rules popup, initApp | — |

**Local state** (`useState` hook/component ke andar) — jo data sirf ek page ka hai (event markets, lobby games).

**UI state** (drawer, timezone, betslip open, sign-in modal) — `src/user-app/context/UiContext.tsx`.

### 6.3 Live data — sockets

| Socket (`src/context/`) | Events (examples) |
|---|---|
| `webSocket` (odds) | `subscribeDashboard`, `dashboardMatches` (listing odds); `joinRoom`/`joinMarketRoom`, `getMarketData`, `getFancyData`, `addNewMarket`, `removeFancy`, `suspendedFancy`, `matchFinished` |
| `webSocketUser` | `login`, `userRoomJoin`, `updateExposer`, `placedBet`, `betDelete`, `logout`, `place-bet` (emit) |
| `webSocketCasino` | casino games |

### 6.4 Kaunsi API bina login ke chalti hai

| Bina token chalti hai | Token chahiye (401) |
|---|---|
| `get-match-list`, `get-sport-list`, `get-casino-games`, `get-casino-int-games`, `get-fancy-list` | `get-user-balance`, `get-market-list`, `get-casino-providers`, `placebet`, `bets` |

Isliye Home / listing / lobby public hain, par **event page aur bet login maangte hain**.

---

## 7. Naya user panel — `src/user-app/`

Reference design: `exchange-website-master-prompt-v2.md` (mobile-first, lordsx.com jaisa).

```
src/user-app/
├── layout/        AppShell (header, bottom nav, sidebar, betslip panel), Header, BottomNav,
│                  SideDrawer, SportList, ProfileSheet, RequireAuth, nav-items, LegacyRedirects…
├── features/
│   ├── home/      HomePage, BannerCarousel, PopularCasino
│   ├── exchange/  ExchangeHub (/exchange), SportListingPage (/exchange/:id)
│   ├── racing/    RacingListing (+ compact variant)
│   ├── event/     EventPage, MarketTable, FancyTable, EventHeader, useEventData, useMyBets,
│   │              bet-payload (bet ka data), market-utils
│   ├── casino/    CasinoLobby, lobbies (config), useLobbyGames
│   └── pages/     NotFoundPage, StaticPage, CasinoDetailSignIn
├── components/    Shared: OddsCell, SuspendedBlock, SportIcon, Sheet, SignInForm/Modal,
│                  ListState, Skeleton, match/ (MatchCard, LeagueGroup, SportSection),
│                  betslip/ (BetslipContent, BetslipOverlay, useBetslip)
├── hooks/         useLiveMatches, useOpenMatch, useUserSession, useClock, useInView…
├── context/       UiContext
├── constants/     sports.ts — 41 sports ki list (drawer, hub, sidebar sab yahin se)
├── utils/         format.ts (time, size), match.ts (runners, teams)
├── styles/        user-app.css — design tokens (--ua-*)
└── icons.ts       react-icons ka typed wrapper — icons yahin se import karo
```

### 7.1 Routes (user)

| Route | Page | Login? |
|---|---|---|
| `/` | Home — banner, Cricket, Popular casino, Football, Tennis (sirf In-Play) | Nahi |
| `/exchange` | Hub — sport chips | Nahi |
| `/exchange/:sportId` | Sport listing (Live/Upcoming). 10 & 65 = Racing | Nahi |
| `/exchange/:sportId/:matchId`, `/odds/:matchId` | Event / market page | Haan |
| `/virtual/...`, `/tp-virtual/...` | Virtual / e-cricket event | Haan |
| `/casino/live \| slots \| crash` | Casino lobby | Nahi (game kholne par login) |
| `/casino-detail/:game/:id` | Standalone Sign-In (bina header) | — |
| `/page/privacy-policy` | Static page | Nahi |
| `/deposit`, `/withdraw`, statements, `/bethistory`, `/unsettledbet`, `/casino/:game/:id` … | **Purane pages** naye shell ke andar | Haan |
| `/match/:id`, `/dashbaord`, `/casino-int/live-casino`… | Purane URL → naye par redirect | — |
| koi aur | 404 | — |

Login-wale pages `RequireAuth` ke andar hain — logout user ko Sign-In card dikhta hai.

### 7.2 Styling ke rules (zaroori)

- Tailwind classes **`tw-` prefix** ke saath: `tw-flex`, `md:tw-hidden`.
- Utilities sirf `#ua-root` (AppShell) ke andar kaam karti hain. Tailwind ka reset (preflight) **band** hai — admin ka Bootstrap safe rahe.
- Naye component ke root par **`ua-ui`** class lagao (font, button/link reset). Purane pages par nahi lagti.
- `rem` ko config mein `px` mein badla hai (purani CSS mobile par `html` 12px karti hai).
- **Golden rule:** apne colours / font sizes mat banao. Tokens use karo:
  - Colours: `tw-bg-primary`, `tw-bg-back`, `tw-bg-lay`, `tw-text-muted-fg`, `tw-bg-suspended`, `tw-text-link`…
  - Type scale: `tw-text-badge` (10), `meta` (12), `body` (14), `strong` (14 bold), `price` (15), `section` (16), `header` (18), `title` (22).
- Bare `<footer>`/`<header>` element purani CSS se style hote hain — dhyan rakho.

### 7.3 Ek naya page kaise jodein

1. `src/user-app/features/<naam>/MyPage.tsx` banao, root par `className='ua-ui'`.
2. Shared components (`MatchCard`, `LeagueGroup`, `EmptyCard`, `ListSkeleton`, `OddsCell`…) use karo.
3. Data: `services/` ka function hook mein call karo; shared data ho to Redux.
4. `src/routes/index.tsx` mein AppShell ke children mein route jodo (login chahiye to `RequireAuth` ke andar), `React.lazy` se import.
5. Teen states banao: loading (skeleton), empty (message), data.

---

## 7A. Naya admin panel — `src/admin-app/{layout,ui,features}`

Reference: `lords-admin-panel-frontend-prompt.md`. Same Tailwind setup (`tw-` prefix, `#ua-root`), admin tokens `--ad-*` (`tw-bg-ad-bg`, `tw-text-ad-success`…) in `admin-app/styles/admin-ui.css`; new components par root class **`ad-ui`**.

```
admin-app/
├── layout/    AdminShell (header, balance strip, sidebar + Events tree, footer), admin-menu.ts
├── ui/        DataTable, ExportButtons (Excel / print-PDF), UserSelect, DateRange (antd), Modal, Tabs, Toggle, Button
├── features/  agents/ (AgentListing, CreateAccount, MultiLogin, modals/), reports/ (AccountStatement,
│              ProfitLoss, CurrentBets), market-analysis/, casino/ (CasinoGrid), event/ (AdminEventPage)
└── pages/     PURANE admin pages — jo abhi redesign nahi hue, naye shell mein safed card par dikhte hain
```

- Routes purane hi hain (`/admin/list-clients`, `/admin/accountstatement`…); naya-UI list `AdminShell.tsx` ke `NEW_UI_PREFIXES` mein hai.
- Paise / lock wale modals (Give, Take, Limit, Credit, Password, Status) ka validation, payload aur API **purane list-clients modals jaisa hi** hai; General Settings abhi purana modal.
- Menu mein sirf wahi spec items hain jinki API maujood hai.

## 8. Bet kaise lagti hai (zaroori — paisa wala flow)

```
OddsCell click
  → bet-payload.ts (marketBet / fancyBet)  — purane code jaisa hi data
  → dispatch(betPopup({ isOpen: true, betData }))   [redux bet slice]
  → Betslip khulta hai (mobile sheet / tablet dialog / xl right panel)
  → stake / odds badle → calculateBetPnl (src/utils/bet-pnl.ts) → profit, liability
  → Place → min/max check → dispatch(getPlaceBetAction(bet))  → POST placebet
  → success: toast, exposure + book update, socketUser.emit('place-bet'), betslip band
```

- PnL ka hisaab **ek hi jagah** hai: `src/utils/bet-pnl.ts` — purana `place-bet-box` aur naya betslip dono yahi use karte hain. Badlo to dono par asar.
- Casino games (`CasinoWrapper`) ka apna purana `PlaceBetBox` hai; naya betslip `betOn: CASINO` ko ignore karta hai.

---

## 9. Login / session

- Login: `loginAction` → token `localStorage` mein → `getUserInfoAction`.
- Naya UI: header **Login** button → Sign-In modal (`SignInForm`). Purana `/login` page bhi chalta hai.
- `useUserSessionEffects` (AppShell): socket login, balance, exposure socket, contacts.
- Non-user role (admin/agent) user panel khole → `/admin` par bhej diya jaata hai.
- Dusre device se login → socket `logout` → reload.

---

## 10. Dhyan dene wali baatein (gotchas)

1. **Match time hack:** API ka `matchDateTime` + 60 min, UTC read karke IST dikhaya jaata hai (purana code bhi yahi karta hai). Sab `src/user-app/utils/format.ts` mein hai — direct `new Date()` mat karo.
2. **"Live"** = start time nikal gaya (API ka `inPlay` kabhi set nahi hota).
3. **Racing data:** ek match = ek race; `series` = country (GB, US), `name` = venue.
4. Socket ke `back[]` mein best price aakhri mein aata hai — best price **value se** chuno (`getLadder`), order se nahi.
5. Folder/route spelling mistakes purane hain (`dashbaord`, `UnsetteleBetHistory`, `ragister`) — URL todne se bachne ke liye rakhe hain.
6. Git mein bahut files sirf line-endings ki wajah se "modified" dikhti hain — commit se pehle dekh lo.
7. `src/pages/odds/*` aur `src/pages/_layout/Main.tsx`, `header.tsx` ab user routes mein use nahi hote (naya EventPage / AppShell). Cashout port karne tak reference ke liye rakhe hain.

## 11. Abhi baaki kaam

- **Cashout** naye event page par nahi hai (purane `match-odds.tsx` mein tha) — pehle ye.
- Listing ke odds se seedha betslip (abhi event page khulta hai).
- Betslip mein ek hi selection (backend ek bet leta hai).
- Purane pages ka redesign: wallet, statements, reports, casino game screens, login page.
- Privacy Policy ka asli text (`features/pages/StaticPage.tsx` — `TODO(content)`).
- Admin: General Settings modal, User Detail modal (§5.1), header quick-view, aur bina-API spec pages (Transfer, Assign Agent, Fraud, Turnover, Sportbook, Live Casino Result, User Authentication). Agent panel (`/agent`) abhi purana.

---

## 12. Shabdkosh (glossary)

| Shabd | Matlab |
|---|---|
| **Back** (blue) | Kisi ke **jeetne** par bet |
| **Lay** (pink) | Kisi ke **na jeetne** par bet |
| **Odds / price** | Bhav; **size / volume** = us bhav par kitna paisa available |
| **Match Odds** | Main market (exchange) |
| **BM / Bookmaker** | Fixed-rate market; size lakh mein (2L) |
| **Fancy (F/F1)** | Session markets (runs, wickets) — **No** (pink) / **Yes** (blue) |
| **Suspended / Ball Running** | Abhi bet nahi lag sakti |
| **Exposure / Liability** | Kitna paisa risk mein hai |
| **Book / PnL** | Har runner par jeet-haar ka hisaab |
| **Stake** | Bet ki rakam |
| **In-Play** | Match chal raha hai |

## Dev login (sirf `npm start` mein, backend ke bina)

File: `src/shared/dev-auth.ts`. Production build (jo `main` push se live jaati hai) mein ye kuch bhi kaam nahi karta.

- **User panel:** normal login screen hai. Login form mein `guest` / `guest123` daalo → koi API call nahi hota, localStorage mein `dev-guest-session = 1` set hota hai aur logged-in pages khul jaate hain (header mein "Guest (dev)", upar peeli dev patti). Logout se session khatam.
  - Bina token ke backend data nahi deta, isliye lists khaali dikhti hain; save/place-bet par "Dev mode: login to save changes" aata hai.
  - Asli username/password daaloge to asli login hi hoga.
  - Band karna ho: `.env.development.local` mein `REACT_APP_USER_DEV_LOGIN=false`.
- **Admin panel:** normal login screen (`/admin/login`). Wahan **"Demo Login (dev)"** button dabao, ya `demo` / `demo123` daalo → localStorage mein `dev-admin-demo-session = 1`, role `admin` maana jaata hai, isliye saara menu aur har page khulta hai (header mein "Demo Admin"). Logout se khatam.
  - Lists khaali, save par "Dev mode: login to save changes" — user guest jaisa hi.
  - Band karna ho: `REACT_APP_ADMIN_DEMO_LOGIN=false`.
  - Sidebar mein **"Soon"** badge wale pages (User History, Turnover, Fraud, Sportbook, Live Casino Result, User Authentication, Our Casino Result, Assign Agent) ki backend API abhi nahi hai — screen taiyar hai, table khaali + note dikhta hai. Code: `src/admin-app/features/reports/pending-pages.tsx`.
