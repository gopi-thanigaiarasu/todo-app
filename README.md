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

## Frontend Setup

1. **Navigate to the frontend project directory:**
   ```bash
   cd frontend/TodoApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application on Android:**
   ```bash
   npx react-native run-android
   ```

   The application will build and launch on your connected Android emulator or device.
