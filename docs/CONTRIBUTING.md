# SMUMods Contributing Guide

Thank you for wanting to contribute to SMUMods! This document outlines how to get started with our project.

## Code of Conduct

Before continuing please read our [Code of Conduct](/docs/CODE_OF_CONDUCT.md).

## Getting Started

This project is configured using pnpm.

### Prerequisites

- pnpm
- docker

### Setup Intructions

Clone the repository

```shell
git clone https://github.com/codie-codes/smu-mods.git && cd smu-mods
```

Install dependencies using pnpm

```shell
pnpm install
```

Set up the environment variables, remember to enter the environment variables in the `.env` file

```shell
cp .env.example .env
```

Run docker to spawn local minio (S3 Compatible storage and postgres)

```shell
docker compose up -d
```

Run database migrations

```shell
pnpm run db:push
```

### Running the development server

Use the following command to run the run a local development server

```shell
pnpm run dev
```

The application will be available on `http://localhost:3000`

### Running the production mode

```shell
pnpm run build
pnpm run start
```
