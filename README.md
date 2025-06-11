# Inkloom Web

Inkloom Web is a modern, full-featured blogging platform built with Angular, Express, and Tailwind CSS. It provides a seamless experience for both readers and writers, with a focus on beautiful design, rich content editing, and social features.

## Features

- **Blog Studio**: Rich text, code, image, and blockquote editing with drag-and-drop and live preview.
- **Authentication**: Email/password, magic link, and OAuth2 (Google, Facebook) login/register flows.
- **Account Management**: Profile editing, avatar upload, and account deletion.
- **Blog Management**: Draft, publish, archive, and delete blogs. Tagging and search support.
- **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly experience.
- **Server-Side Rendering**: Fast initial loads and SEO-friendly via Angular SSR and Express.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Angular CLI](https://angular.io/cli)

### Installation

```sh
npm install
```

### Environment Variables

Copy the example environment file and update values as needed:

```sh
cp src/environments/environment.example.ts src/environments/environment.ts
```

Edit `src/environments/environment.ts` for your API and OAuth credentials.

### Development Server

```sh
npm start
```

Visit [http://localhost:4200](http://localhost:4200) in your browser.

### Build

```sh
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Server-Side Rendering (SSR)

```sh
npm run build
node dist/inkloom-web/server/server.mjs
```

### Running Tests

```sh
npm test
```

## Project Structure

- `src/app/` — Angular application code (components, services, models)
- `server.ts` — Express SSR server
- `tailwind.config.js` — Tailwind CSS configuration
- `src/environments/` — Environment configs

## Main Scripts

- `npm start` — Start dev server
- `npm run build` — Build for production
- `npm test` — Run tests
