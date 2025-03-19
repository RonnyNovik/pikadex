# Pikadex
Pikadex is an app designed to fetch data from the PokeAPI and present it to the user via clean and intuitive UI
allowing the user to search the pokemon by name or choose and show their favorite pokemons

## Personal Note

Hey everyone, I'd like to expand on some of my technical decisions.

I implemented a user-based authentication system to manage favorites per user, which provides a better experience on the deployed app and prevents state conflicts between users.

For data persistence, I opted for a dedicated database as the setup was straightforward and improved the development experience. While I implemented a basic caching system to demonstrate the concept, in a production environment I would use a more robust solution like Redis, depending on scale requirements.

Regarding testing, I focused on core logic and key components. The backend has comprehensive test coverage, while the frontend tests demonstrate my testing approach through two main components.

I implemented the bonus features with a focus on usability. The design prioritizes user experience and mobile responsiveness, with minimal animations to balance functionality and development time.

For frontend state management, I chose React Query over Redux for several advantages:
- Built-in caching capabilities
- Efficient error and loading state handling
- Native infinite scrolling support
- Simpler implementation for this use case

While there's room for improvement - such as refining the loader behavior, extracting more logic into custom hooks, and enhancing the backend with Zod schemas - I believe this implementation demonstrates my approach to code organization and architecture.

Let's get started with running the app!

The testing user for the app is -
 - user name: TestUser
 - password: Test123!

## Technical Approach

### Architecture Overview
The application follows a modern full-stack architecture with clear separation of concerns:

#### Frontend
- **React 18 with TypeScript**: Leveraging modern React features and type safety
- **State Management**: Using React Query (TanStack Query) for efficient server state management
- **Component Architecture**: 
  - Custom hooks for data fetching and state management
  - Reusable UI components with CSS Modules
  - Lazy loading for images and components
- **Performance Optimizations**:
  - Infinite scrolling for Pokémon lists
  - Client-side caching with React Query
  - Lazy loading of images and components
  - Optimistic updates for favorites

#### API
- **Express.js with TypeScript**: Type-safe API development
- **Caching Strategy**:
  - Caching system using NodeCache
  - Different TTLs for different data types
  - Cache invalidation patterns
- **Error Handling**:
  - Custom error classes for different scenarios
  - Centralized error handling middleware
  - Rate limiting and external API error handling
- **Data Management**:
  - MongoDB for user data and favorites
  - Efficient batch processing for external API calls
  - Structured response transformation
  - Batching for use cases where multiple requests are needed at once from the PokeAPI

### Key Technical Decisions
1. **Caching Strategy**: Implemented a sophisticated caching system to minimize external API calls while ensuring data freshness
2. **Type Safety**: Full TypeScript implementation across both frontend and backend for better maintainability
3. **Performance**: Optimized for large datasets with infinite scrolling and efficient data fetching
4. **Scalability**: Modular architecture allowing for easy feature additions and maintenance
5. **User Experience**: Responsive design with loading states and error handling

## Techological Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v7
- **Styling**: CSS Modules
- **Testing**: Vitest + React Testing Library
- **Development**: TypeScript, ESLint, SWC

#### API
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Testing**: Vitest

## Prerequisites
- Minimum: Node.js 18.17.0
- Recommended: Node.js 20+
- MongoDB (for backend)
- Docker (optional)

## Environment Setup

### Frontend Environment
The frontend requires a `.env` file in the `frontend` directory. You can create it by copying the `.env.example`:

```bash
cd frontend
cp .env.example .env
```

Required environment variables:
- `VITE_API_URL`: The URL of the backend API (default: http://localhost:3000)

### API Environment
The backend requires a `.env` file in the `api` directory. You can create it by copying the `.env.example`:

```bash
cd api
cp .env.example .env
```

### 

Required environment variables:
- `NODE_ENV`: The environment mode (development/production)
- `POKEAPI_BASE_URL`: The base URL for the PokeAPI (default: https://pokeapi.co/api/v2)
- `MONGODB_URI`: The MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## How to start
The first step to running the app is installing the NPM packages of each codebase

#### Frontend
```bash
cd frontend
npm install
```

#### API
```bash
cd api
npm install
```

After that you can choose the way you want to run the app, you can do it via running the apps locally or using Docker:

### Method A: Running locally

#### Frontend
```bash
cd frontend
npm run dev
```

#### API (First time running)
```bash
cd api
npm run dev:setup
```

#### API (After DB is seeded)
```bash
cd api
npm run dev
```

### Method B: Docker compose
```bash
docker compose up
```

### The application will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

## API Integration

### Authentication Endpoints
- **POST /auth/register**
  - Purpose: Register a new user
  - Body: `{ username: string, password: string }`
  - Returns: `{ accessToken: string }`

- **POST /auth/login**
  - Purpose: Authenticate existing user
  - Body: `{ username: string, password: string }`
  - Returns: `{ accessToken: string }`

### Pokemon Endpoints
- **GET /pokemons/list**
  - Purpose: Get paginated list of Pokemon
  - Query Params: `limit` (default: 150), `offset` (default: 0)
  - Authentication: Required

- **GET /pokemons/by-name/:name**
  - Purpose: Get detailed Pokemon information by name
  - Params: `name` (Pokemon name)
  - Authentication: Required

- **GET /pokemons/search**
  - Purpose: Search Pokemon by name
  - Query Params: `searchQuery`
  - Authentication: Required

### Favorites Endpoints
- **GET /favorites/list**
  - Purpose: Get user's favorite Pokemon
  - Query Params: `limit` (default: 150), `offset` (default: 0)
  - Authentication: Required

- **POST /favorites/add/:pokemonId**
  - Purpose: Add Pokemon to favorites
  - Params: `pokemonId`
  - Body: `{ name: string }`
  - Authentication: Required

- **DELETE /favorites/remove/:pokemonId**
  - Purpose: Remove Pokemon from favorites
  - Params: `pokemonId`
  - Authentication: Required

### Authentication
All endpoints except `/auth/login` and `/auth/register` require a JWT token in the Authorization header:
```bash
Authorization: Bearer <access_token>
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

