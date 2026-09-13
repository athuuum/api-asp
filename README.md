# GameStore

A full-stack game catalog application. The backend exposes a RESTful API built with ASP.NET Core Minimal APIs, and the frontend is a React single-page application that allows users to browse, create, update, and delete game entries.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)

---

## Tech Stack

### Backend — `GameStore.Api`

| Technology | Version | Role |
|---|---|---|
| .NET | 10.0 | Runtime and SDK for the backend application |
| ASP.NET Core Minimal APIs | 10.0 | Defines HTTP endpoints without controller classes, keeping routing logic concise and explicit |
| Entity Framework Core | 10.0.11 | Object-relational mapper used to model the database schema, run migrations, and execute async queries against SQLite |
| Microsoft.EntityFrameworkCore.Sqlite | 10.0.11 | EF Core database provider that targets a local SQLite file (`GameStore.db`) |
| Microsoft.EntityFrameworkCore.Design | 10.0.11 | Design-time tooling required to scaffold and apply EF Core migrations via the `dotnet ef` CLI |

**How the backend works:**

- `Program.cs` wires up all services (database context, validation, CORS) and maps two endpoint groups: `/games` and `/genres`.
- `GameStoreContext` is the EF Core `DbContext` that exposes `Games` and `Genres` as queryable sets.
- `DataExtensions.cs` contains two helpers: `AddGameStoreDb` registers the SQLite context and seeds the `Genres` table on first run, and `MigrateDb` applies any pending EF Core migrations automatically at application startup.
- DTOs (Data Transfer Objects) in the `Dtos` folder decouple the HTTP contract from the internal domain models.
- CORS is configured to allow requests from `http://localhost:5173`, which is the default address of the Vite development server.

### Frontend — `GameStore.Frontend`

| Technology | Version | Role |
|---|---|---|
| React | 19 | UI component library for building the single-page application |
| Vite | 8 | Build tool and development server; provides hot module replacement (HMR) during development |
| Tailwind CSS | 4 | Utility-first CSS framework, integrated directly into Vite via the `@tailwindcss/vite` plugin |
| oxlint | 1 | Fast JavaScript/JSX linter used to enforce code quality rules |

**How the frontend works:**

- `src/services/api.js` is the single file responsible for all HTTP communication with the backend. It targets `http://localhost:5118` and wraps `fetch` calls for all CRUD operations on games and genres.
- `src/components/` contains three focused components: `GamesTable.jsx` renders the list of games, `GameForm.jsx` handles both create and update forms, and `DeleteModal.jsx` provides a confirmation dialog before deletion.
- `src/App.jsx` composes these components and manages top-level application state.

---

## Prerequisites

Ensure the following tools are installed before proceeding.

**Backend:**

- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0) — verify with:
  ```
  dotnet --version
  ```
- [dotnet-ef CLI tool](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) — used to manage migrations. Install globally with:
  ```
  dotnet tool install --global dotnet-ef
  ```
  Verify with:
  ```
  dotnet ef --version
  ```

**Frontend:**

- [Node.js](https://nodejs.org/) (LTS recommended, v18 or later) — verify with:
  ```
  node --version
  ```
- npm (ships with Node.js) — verify with:
  ```
  npm --version
  ```

---

## Project Structure

```
GameStore/
├── GameStore.slnx               # .NET solution file
├── GameStore.Api/               # ASP.NET Core backend
│   ├── Data/
│   │   ├── GameStoreContext.cs  # EF Core DbContext
│   │   ├── DataExtensions.cs   # DB registration, seeding, and migration helpers
│   │   └── Migrations/         # Auto-generated EF Core migration files
│   ├── Dtos/                   # Data Transfer Objects for request/response shapes
│   ├── Endpoints/
│   │   ├── GamesEndpoints.cs   # GET, POST, PUT, DELETE /games
│   │   └── GenresEndpoints.cs  # GET /genres
│   ├── Models/
│   │   ├── Game.cs
│   │   └── Genre.cs
│   ├── appsettings.json        # Production configuration (connection string)
│   ├── appsettings.Development.json
│   ├── games.http              # Manual API test requests (VS Code REST Client)
│   └── Program.cs              # Application entry point
└── GameStore.Frontend/          # React + Vite frontend
    ├── src/
    │   ├── components/         # GamesTable, GameForm, DeleteModal
    │   ├── services/
    │   │   └── api.js          # All fetch calls to the backend
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Environment Variables

The backend is configured through the standard ASP.NET Core `appsettings.json` files. No `.env` file is needed for a local development setup.

**`GameStore.Api/appsettings.json`** (already present in the repository):

```json
{
  "ConnectionStrings": {
    "GameStore": "Data Source=GameStore.db"
  }
}
```

This instructs EF Core to create and use a file named `GameStore.db` in the `GameStore.Api` project directory. The file is created automatically on first run and is excluded from version control via `.gitignore`.

If you need to point the API at a different SQLite file path, change the `Data Source` value in `appsettings.json` before running the application. For environment-specific overrides, add the connection string to `appsettings.Development.json` or set the environment variable:

```
CONNECTIONSTRINGS__GAMESTORE=Data Source=/your/custom/path/GameStore.db
```

The frontend does not use environment variables. The backend base URL is hardcoded in `GameStore.Frontend/src/services/api.js` as `http://localhost:5118`. If the API runs on a different port, update that constant in `api.js`.

---

## Database Setup

The project uses SQLite managed by Entity Framework Core. Migration files already exist in `GameStore.Api/Data/Migrations/`, so you do not need to generate new ones for a fresh setup.

**Migrations are applied automatically at startup.** When the backend starts, `MigrateDb()` is called in `Program.cs`, which runs all pending migrations against the database file. The `Genres` table is also seeded automatically on first run with default values (Fighting, RPG, Platformer, Racing, Sports).

If you prefer to apply migrations manually before starting the API, run the following command from inside the `GameStore.Api` directory:

```
dotnet ef database update
```

This creates `GameStore.db` (if it does not exist) and applies the `InitialCreate` and `PendingChanges` migrations in order.

**To add a new migration** after modifying a model, run from inside `GameStore.Api`:

```
dotnet ef migrations add <MigrationName>
```

**To revert to a previous migration:**

```
dotnet ef database update <MigrationName>
```

**To remove the last unapplied migration:**

```
dotnet ef migrations remove
```

---

## Running the Application

Both the backend and frontend must run simultaneously. Open two separate terminal windows.

### Terminal 1 — Backend API

```
cd "GameStore.Api"
dotnet run
```

The API will start and listen on `http://localhost:5118`. On first run, the SQLite database file is created and migrations are applied automatically.

To run with the Development environment explicitly set (enables more verbose logging):

```
$env:ASPNETCORE_ENVIRONMENT = "Development"   # PowerShell
dotnet run
```

Or on macOS/Linux:

```
ASPNETCORE_ENVIRONMENT=Development dotnet run
```

### Terminal 2 — Frontend

```
cd "GameStore.Frontend"
npm install
npm run dev
```

The Vite development server starts at `http://localhost:5173`. Open that URL in your browser.

`npm install` only needs to be run once after cloning the repository, or again after any changes to `package.json`.

### Verifying the Setup

Once both processes are running:

1. Open `http://localhost:5173` — you should see the game catalog UI.
2. Open `http://localhost:5118/genres` in a browser or HTTP client — you should receive a JSON array containing the five seeded genres.
3. Open `http://localhost:5118/games` — returns an empty array until you add games through the UI or the API.

---

## API Reference

The base URL for all endpoints is `http://localhost:5118`. Sample request bodies are also available in `GameStore.Api/games.http` for use with the VS Code REST Client extension.

### Games

| Method | Route | Description | Request Body |
|---|---|---|---|
| GET | `/games` | Returns all games with genre name | None |
| GET | `/games/{id}` | Returns a single game by ID | None |
| POST | `/games` | Creates a new game | See below |
| PUT | `/games/{id}` | Updates an existing game | See below |
| DELETE | `/games/{id}` | Deletes a game by ID | None |

**POST / PUT request body:**

```json
{
  "name": "string",
  "genreId": 1,
  "price": 59.99,
  "releaseDate": "2026-01-01"
}
```

### Genres

| Method | Route | Description |
|---|---|---|
| GET | `/genres` | Returns all available genres |
