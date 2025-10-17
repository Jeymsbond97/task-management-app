# Task Management App

Description
This is a full-stack Task Management Application. User authentication, task management, login, logout process and CRUD operations.

### Frontend (React + React Query)

- Built with **React.js** (Vite) and **React Query** for state and data fetching.
- Axios for API requests.
- Component-based architecture using reusable UI components.
- CSS Modules used for scoped styling.
- Icons imported from Lucide React /Materia UI.
- Pages included:  
  - Login Page  
  - Registration Page  
  - Tasks Dashboard (CRUD operations)
- Users can login, register, and logout. Session state is clearly shown in the UI.
- Tasks are fetched for the logged-in user only, using React Query `useQuery`.
- Create/Update/Delete operations implemented using React Query `mutations`.
- Optimistic updates for better UX and automatic refetch after mutations.
- Loading and error states are displayed using React Query metadata.
- Optional bonus features: Task filtering by status, sleek and responsive UI, cache clearing on page change.

### Backend (Laravel 10 + MySQL)

- REST API endpoints for authentication and task management.
- User authentication implemented with **JWT via Laravel Sanctum**.
- Registration, Login, and Logout endpoints.
- All data operations restricted to the authenticated user (no global/shared tasks).
- Form Request validation used for user registration and task creation/updating.
- Eloquent API Resources used for consistent API responses.
- Migration files included for all tables (`users`, `tasks`) with proper schema setup.
- Task model includes `scopeSearch($query, $term)` for filtering by title.
- CORS configured to allow React frontend to access the API.
- `.env.example` included for database and API configuration.

### Features

- User registration and login with JWT authentication.
- CRUD operations for tasks.
- Responsive UI with modern design.
- Error handling and loading indicators.
- Password visibility toggle.

### Folder Structure

/backend → Laravel API
/frontend → React app

### Setup Instructions

### Backend

1. Go to `/backend`
2. Copy `.env.example` to `.env` and set your environment variables
3. Install dependencies:
4. ```bash
5. composer install
6. Run migrations:
7. php artisan migrate
8. php artisan serve

### Frontend:

Go to /frontend

Copy .env.example to .env

Install dependencies:
npm install
npm run dev

### Environment Variables

Backend: See /backend/.env.example
Frontend: See /frontend/.env.example

## API and React Query Decisions

For this project, I decided to use React Query to efficiently manage server state and caching. Task mutations are handled with optimistic updates to provide a smoother user experience. Axios is used to make API requests, including sending JWT tokens for authentication. On the backend, I structured the endpoints as a RESTful API using Laravel controllers and resource classes. Validation logic is centralized in Laravel Form Requests to keep the controllers clean and maintainable. I also implemented a scopeSearch method in the Task model to allow flexible task filtering, and configured CORS so that the React frontend can communicate with the Laravel API seamlessly.

### Contribution

This assignment is submitted as is for review. Partial completion is allowed, but the full stack functionality has been implemented according to assignment requirements.
