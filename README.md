# ToDo Application (React Native + NestJS)

This repository contains a simple ToDo application built with React Native for the frontend and NestJS for the backend.

## Project Structure

- `/frontend`: Contains the React Native mobile application.
- `/backend`: Contains the NestJS RESTful API.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment (see [React Native Getting Started](https://reactnative.dev/docs/environment-setup))
- An Android emulator or a physical device

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run start:dev
   ```
The backend will be running at `http://localhost:3000`.

API Docs (Swagger): after installing backend dependencies, open `http://localhost:3000/docs` for interactive API documentation.

## Frontend Setup

1. **Navigate to the frontend project directory:**
  ```bash
  cd frontend/todo
  ```

2. Install dependencies

  ```bash
  npm install
  ```

3. Start the app

  ```bash
  npx expo start
  ```

  The application will build and launch on your connected Android emulator or device.

### Configuring the API URL

The app uses `process.env.EXPO_PUBLIC_API_URL` if provided. If not set, it defaults to:

- Android emulator: `http://10.0.2.2:3000`
- iOS simulator: `http://127.0.0.1:3000`
- Physical devices: set `EXPO_PUBLIC_API_URL` to your machine's LAN IP (e.g., `http://192.168.1.10:3000`).

Examples for starting the Expo app with a custom API URL:

- Windows PowerShell
  ```powershell
  $env:EXPO_PUBLIC_API_URL="http://127.0.0.1:3000"; npx expo start
  ```
- macOS/Linux
  ```bash
  EXPO_PUBLIC_API_URL=http://127.0.0.1:3000 npx expo start
  ```
