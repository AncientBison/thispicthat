# 🖼️ ThisPicThat

**ThisPicThat** is a web application designed to make foreign language learning fun and visual.  
It uses a **picture-based approach** to help learners associate words with images naturally and intuitively.

---

## 🚀 Technologies Used

### **Framework**
- [Next.js 15](https://nextjs.org/docs) — React-based full-stack web framework with App Router and Turbopack.

### **Language & Tooling**
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development.
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — Code quality and formatting.
- [Drizzle ORM](https://orm.drizzle.team/) — Type-safe SQL ORM.
- [PostgreSQL](https://www.postgresql.org/) — Relational database.
- [dotenv](https://github.com/motdotla/dotenv) — Environment configuration.

### **Authentication & Internationalization**
- [next-auth](https://authjs.dev/) — Authentication for Next.js.
- [@auth/drizzle-adapter](https://authjs.dev/reference/adapter/drizzle) — Auth.js + Drizzle integration.
- [next-intl](https://next-intl-docs.vercel.app/) — Internationalization and translation handling.

### **Styling & UI**
- [HeroUI v2](https://heroui.com/) — Modern UI component library.
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework.
- [Tailwind Variants](https://tailwind-variants.org) — Variant-based styling.
- [Framer Motion](https://www.framer.com/motion/) — Animations and transitions.
- [next-themes](https://github.com/pacocoursey/next-themes) — Light/dark theme switching.

### **State Management**
- [Jotai](https://jotai.org/) — Minimal, atomic React state management.

### **Media & Utilities**
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) — Image optimization.
- [react-plock](https://www.npmjs.com/package/react-plock) — Responsive grid layouts.
- [intl-messageformat](https://formatjs.io/docs/intl-messageformat/) — ICU-style message formatting.

---

## 🛠️ Getting Started

### **1. Clone the Repository**
```bash
git clone https://github.com/AncientBison/ThisPicThat.git
cd ThisPicThat
```

### **2. Install Dependencies**
You can use `npm`, `yarn`, `pnpm`, or `bun`.  
Example with npm:
```bash
npm install
```

### **3. Setup Environment Variables**

Create a `.env` file in the root directory and configure your environment variables.

Example:
```bash
# Server
PORT=3000
ENV=development

# Database
POSTGRES_URL="postgresql://user:password@localhost:5432/thispicthat"

# Auth.js (Google OAuth)
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Image settings
MAX_IMAGE_DIMENSION=1024
```

These variables are validated at runtime using **Zod** inside [`env.ts`](./src/env.ts), ensuring type safety and preventing startup with invalid configuration.

### **4. Setup the Database**

*Prerequisite: You will need a **PostgresSQL** database you can connect to.*

Push the databse schema to the database:
```bash
npx drizzle-kit push
```

*Note: I did not include any default pictures. You will have to supply these at this point in `/db/default/items/[item_name].webp`.*

Setup default items:
```bash
npm run setup
```

### **5. Run the Development Server**
```bash
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Optional: Using pnpm

If you use `pnpm`, add this to your `.npmrc` file to ensure proper hoisting:
```bash
public-hoist-pattern[]=*@heroui/*
```

Then reinstall dependencies:
```bash
pnpm install
```

---

## 🧠 Key Features

- 🖼️ **Image-based learning** — Strengthen vocabulary through visual association  
- 🌍 **Multi-language support** — Easily switch between native and target languages  
- 🧩 **Modular collections** — Organize words and phrases into themed groups  
- 🔐 **User authentication** — Secure sign-in via Auth.js  
- 🌓 **Light/Dark themes** — Fully theme-aware interface  
- ⚡ **Optimized performance** — Powered by Turbopack and Drizzle ORM  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
