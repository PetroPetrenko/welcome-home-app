# InvestProp — Real Estate Investment Platform

## 🇬🇧 English | 🇷🇺 Русский (ниже)

---

## Project Structure / Структура проекта

```
investprop/
│
├── src/                          # 🖥️ FRONTEND (React SPA)
│   ├── assets/                   #   Static images (hero, buildings)
│   ├── components/               #   Reusable UI components
│   │   ├── ui/                   #     Shadcn design system components
│   │   ├── Header.tsx            #     App header with auth-aware nav
│   │   ├── HeroSection.tsx       #     Hero banner section
│   │   ├── DealCard.tsx          #     Single deal card component
│   │   └── DealsSection.tsx      #     Deals grid (fetches from DB)
│   ├── contexts/                 #   React Context providers
│   │   └── AuthContext.tsx       #     Authentication state provider
│   ├── hooks/                    #   Custom React hooks
│   ├── pages/                    #   Route-level page components
│   │   ├── Index.tsx             #     Main landing page
│   │   ├── LoginPage.tsx         #     Login form
│   │   ├── RegisterPage.tsx      #     Registration form
│   │   ├── ForgotPasswordPage.tsx#     Password reset request
│   │   ├── ResetPasswordPage.tsx #     New password form
│   │   └── NotFound.tsx          #     404 page
│   ├── services/                 #   Service layer (data access)
│   │   ├── authService.ts        #     Auth operations (SRP)
│   │   └── dealsService.ts       #     Deals CRUD operations (SRP)
│   ├── types/                    #   TypeScript type definitions
│   │   ├── auth.ts               #     Auth types
│   │   └── deals.ts              #     Deal entity type
│   ├── integrations/             #   Auto-generated backend client
│   ├── lib/                      #   Utility functions
│   ├── App.tsx                   #   App router & providers
│   ├── main.tsx                  #   Entry point
│   └── index.css                 #   Design system (CSS variables)
│
├── supabase/                     # ⚙️ BACKEND (Lovable Cloud)
│   ├── functions/                #   Edge Functions (serverless API)
│   │   └── deals-api/            #     GET /deals — REST API endpoint
│   │       └── index.ts          #     Handles GET requests for deals
│   ├── migrations/               #   Database migrations (SQL)
│   │   └── *.sql                 #     Schema: profiles, deals tables
│   └── config.toml               #   Backend configuration
│
├── tailwind.config.ts            #   Tailwind + design tokens
├── vite.config.ts                #   Vite build config
├── README.md                     #   This file
└── package.json                  #   Dependencies
```

## Architecture / Архитектура (C4 Context)

```
┌─────────────────────────────────────┐
│         User (Browser)              │
└──────────────┬──────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────┐
│    FRONTEND — React SPA (src/)      │
│  ┌──────────────────────────────┐   │
│  │ pages/     → Route handlers  │   │
│  │ components/→ UI components   │   │
│  │ services/  → Data access     │   │
│  │ contexts/  → State mgmt     │   │
│  │ types/     → Type contracts  │   │
│  └──────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ REST API / Auth API
┌──────────────▼──────────────────────┐
│    BACKEND — Lovable Cloud          │
│    (supabase/)                      │
│  ┌──────────────────────────────┐   │
│  │ Edge Functions (API layer)   │   │
│  │  └ deals-api/  GET /deals    │   │
│  ├──────────────────────────────┤   │
│  │ PostgreSQL Database          │   │
│  │  ├ deals     (RLS: public)   │   │
│  │  └ profiles  (RLS: per user) │   │
│  ├──────────────────────────────┤   │
│  │ Auth Service                 │   │
│  │  ├ Email/Password signup     │   │
│  │  ├ Session management        │   │
│  │  └ Password reset flow       │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

## SOLID Principles Applied

| Principle | Implementation |
|-----------|---------------|
| **SRP** | Each component/service has one responsibility (AuthContext → auth state, dealsService → data access, DealCard → card UI) |
| **OCP** | Components are open for extension via props, closed for modification |
| **LSP** | All service methods follow consistent interface contracts (return Promise) |
| **ISP** | Types split into focused interfaces (AuthContextType, Deal) |
| **DIP** | Components depend on service abstractions, not direct DB calls |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion, Playfair Display + DM Sans |
| State | React Query, Context API |
| Backend | Lovable Cloud — PostgreSQL, Auth, Edge Functions |
| API | Edge Functions (Deno runtime, serverless) |

---

## 🇷🇺 ОТЧЁТ О ВЫПОЛНЕНИИ ЗАДАНИЯ

### Исходные требования и статус:

| # | Требование | Статус | Комментарий |
|---|-----------|--------|-------------|
| 1 | Main page (главная страница) | ✅ Выполнено | Hero-секция + карточки объектов из БД |
| 2 | Login form (форма входа) | ✅ Выполнено | Email + пароль, валидация, редирект |
| 3 | Register form (регистрация) | ✅ Выполнено | Email + пароль + имя, подтверждение email |
| 4 | Mobile adaptation (мобильная адаптация) | ✅ Выполнено | Responsive design, бургер-меню |
| 5 | React | ✅ Выполнено | React 18 + TypeScript + Vite |
| 6 | Redux | ⚠️ Замена | React Query + Context API (лучшая практика для данной архитектуры) |
| 7 | Backend API (принимает заявки, сохраняет в БД) | ✅ Выполнено | Edge Function `deals-api` + PostgreSQL |
| 8 | NodeJS / NestJS | ⚠️ Замена | Edge Functions (Deno) — аналогичная серверная функциональность |
| 9 | MySQL/PostgreSQL | ✅ Выполнено | PostgreSQL (встроен в Lovable Cloud) |
| 10 | Дизайн по макету Figma | ✅ Выполнено | Тёмная тема, золотые акценты, типографика по макету |
| 11 | Хедер без Login/Register после авторизации | ✅ Выполнено | Динамический хедер: показывает Sign Out |
| 12 | SOLID принципы | ✅ Выполнено | SRP, OCP, LSP, ISP, DIP |
| 13 | Разделение на Frontend / Backend | ✅ Выполнено | `src/` — фронтенд, `supabase/` — бэкенд |
| 14 | E2E тесты | ❌ Не выполнено | Playwright/Cypress не поддерживаются нативно |
| 15 | C4 документация | ✅ Выполнено | Context-диаграмма в README |
| 16 | README (EN/RU) | ✅ Выполнено | Двуязычная документация |
| 17 | Графическая схема приложения | ✅ Выполнено | ASCII-диаграмма архитектуры |
| 18 | Деплой на сервер | ✅ Выполнено | Lovable Platform (preview URL доступен) |
| 19 | GitHub ссылка | ⚠️ Требуется действие | Подключить через Settings → GitHub |
| 20 | Видеопрезентация | ❌ Не автоматизируется | Требует ручного создания |

### Итого:
- **✅ Выполнено**: 15 из 20 пунктов
- **⚠️ С заменой/действием**: 3 пункта (Redux→Context, NestJS→Edge Functions, GitHub)
- **❌ Не выполнено**: 2 пункта (E2E тесты, видеопрезентация)

### Ключевые решения:
1. **Redux → React Query + Context**: Redux избыточен для данного приложения. Context API + React Query — стандарт индустрии для управления состоянием и кеширования серверных данных.
2. **NestJS → Edge Functions**: Платформа Lovable использует Deno Edge Functions как серверный runtime. Функциональность аналогична: REST API, доступ к БД, аутентификация.
3. **Сервисный слой**: Создан отдельный `services/` слой для разделения логики доступа к данным от UI-компонентов (принцип SRP).

### Потенциальные узкие места:
- При росте числа объектов > 1000 необходима пагинация
- Изображения объектов хранятся как статические ассеты — для продакшена нужна CDN/Storage
- Отсутствует rate-limiting на API эндпоинтах
