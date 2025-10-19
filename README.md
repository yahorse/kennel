# Kennel Boarding Platform

A full-stack MERN application scaffold for managing a dog kennel boarding business. The project is organized as a Render-ready monorepo with separate client (React + Tailwind) and server (Express + MongoDB) workspaces.

## Project Structure

```
.
├── client/   # React single-page app (Vite + Tailwind)
└── server/   # Express API with Mongoose models
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm, npm, or yarn
- MongoDB connection string

### Environment Variables

Copy `server/.env.example` to `server/.env` and update the values:

```
PORT=5000
MONGO_URI=your-mongodb-connection-string
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret
```

### Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Run Locally

In one terminal, start the backend:

```bash
cd server
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

The client will run at `http://localhost:5173` and the API at `http://localhost:5000`.

## Key Features

- **Mongoose Models** for kennels, pets, and bookings with validation.
- **RESTful API** covering availability checks, booking creation, pet management, and admin workflows.
- **React SPA** with dedicated flows for clients and admin staff, built using functional components, hooks, and Tailwind CSS.
- **Render-ready configuration** including `process.env.PORT`, CORS, and environment-driven settings.

## Deployment Notes

- Configure the server to run `npm start` on Render, ensuring environment variables are set.
- Build the client with `npm run build` and serve static assets via a CDN or Render static site service.
- Update `VITE_API_URL` in the client environment to point to the deployed API URL.

## Next Steps

- Implement real authentication with JWT-based middleware.
- Add pagination, sorting, and search for bookings and pets.
- Integrate form validation and optimistic UI states.
- Create automated tests (unit/integration) for both client and server packages.
