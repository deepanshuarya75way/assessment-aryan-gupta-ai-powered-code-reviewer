# Chapter 0 — Project Init (Next.js v16.2.9)

## Command
```bash
npx create-next-app@latest || npx create-next-app@16.2.9
```
- Project name: `./`
- Recommended Next.js defaults: `yes`

# Chapter 1 — UI Foundation: shadcn/ui, Dark Mode, TanStack Query

## Step 1 shadcn/ui
- shadcn -> build your own -> shuffle(for color) -> get code -> template: `Next.js` -> base UI : `Radix UI` -> Use pointer on buttons(enable) -> copy npm cmd and execute

```bash
npx shadcn@latest init --preset b7Br7G7Ci --base radix --template next --pointer
```

- shadcn all components: to select all components

```bash
npx shadcn@latest add
```

## Step 2 Dark Mode
- shadcn -> search(dark mode) -> select(Nextjs)

## 2.1
```bash
npm install next-themes
```

## 2.2 Create a theme provider
- components/providers/theme-provider.tsx (copy/paste code)

## 2.3 Wrap your root layout
- app/layout.tsx (edit/copy/paste code)

## 2.4 Add a mode toggle
- components/ui/mode-toggle.tsx (copy/paste code)
- app/page.tsx -> add <ModeToggle/> component

## Step 3 TanStack Query
## 3.1
- TanStack Query -> get started -> installation

```bash
npm i @tanstack/react-query
```

## 3.2 setup
- components\providers\query-provider.tsx (write code)(for QueryProvider)
- wrap the whole application using this (QueryProvider)
    - app/layout.tsx
    ```bash
    <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
    </body>
    ```

# Chapter 2 — Database with Prisma via neon
## 1
- neon.com -> new project -> write name -> create -> connect -> connection string: prisma -> .env -> show pass -> copy snippet -> paste in your .env

```bash
DATABASE_URL="postgresql://neondb_owner:**********************
```

## 2
- prisma -> get started -> Prisma ORM -> Postgres
    - Install required dependencies
    ```bash
    npm install prisma @types/pg --save-dev
    npm install @prisma/client @prisma/adapter-pg pg dotenv
    ```

## 3.1
```bash
npx prisma init
```

## 3.2
- lib/db.ts (copy/paste code)

## 3.3
```bash
npx prisma generate
```

## 3.4
- prisma/schema.prisma
```bash
model Test {
  id String @id @default(cuid())
  title String
}
```

## 3.5
```bash
npx prisma migrate dev
```

## 3.6
```bash
npx prisma generate
```