# SMUMODs

A web application designed to help SMU students plan their modules effectively. It provides features for module search, timetable planning, and easy access to module information.

## Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/darkliyznyanlin910/smu-mods.git
cd SMUMODs
```

2. Install dependencies
   This project is configured to work with `pnpm` so install pnpm first.

```bash
pnpm install
```

3. Set up environment variables

- Copy `.env.example` to `.env`
- Fill up required environment variables

4. Run the application

- Running in development mode

```bash
pnpm run dev
```

- Running in production mode

```bash
pnpm run build
pnpm run start
```

The application will be available at `http://localhost:3000`
