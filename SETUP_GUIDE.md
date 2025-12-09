# Setup Guide - Antd Components with Optional Features

This guide explains how to use the enhanced CLI to set up your project with optional features.

## Features Available

### Core Features (Always Included)
- ✅ Antd Components (custom theme)
- ✅ Tailwind CSS (custom theme)
- ✅ Axios Instant (custom service with auth)
- ✅ js-cookie integration

### Optional Features (Selectable)
- 🔍 Tanstack Query (Next.js)
- 🛣️ Routing: Tanstack Router OR React Router DOM
- 🗄️ State Management: Zustand OR Redux
- 📋 Form Library: React Hook Form OR Olapat
- 📝 Language: TypeScript OR JavaScript

## Installation

Run the CLI with interactive prompts:

```bash
npx antd-components init
```

The CLI will ask you to select:
1. **Language**: TypeScript or JavaScript
2. **Routing**: None, Tanstack Router, or React Router DOM
3. **State Management**: None, Zustand, or Redux
4. **Form Library**: None, React Hook Form, or Olapat
5. **Tanstack Query**: Yes or No

## Usage Examples

### Using Axios Instant

```tsx
import { axiosInstant } from './services';

// GET request
const response = await axiosInstant.get('/api/users');

// POST request
const response = await axiosInstant.post('/api/users', { name: 'John' });

// Set token after login
axiosInstant.setToken('your-access-token');

// Clear token on logout
axiosInstant.clearAuth();
```

### Using Tanstack Query

```tsx
import { QueryProvider } from './lib/tanstack-query';
import { useApiQuery, useApiMutation } from './lib/tanstack-query-hooks';

// In your app layout
function App() {
  return (
    <QueryProvider enableDevtools>
      <YourApp />
    </QueryProvider>
  );
}

// In your component
function UsersList() {
  const { data, isLoading } = useApiQuery('users', '/api/users');
  const createUser = useApiMutation('/api/users');
  
  // Use data and mutations
}
```

### Using Routing

#### Tanstack Router
```tsx
import { TanstackRouterProvider } from './lib/routing/tanstack-router';

function App() {
  return <TanstackRouterProvider />;
}
```

#### React Router DOM
```tsx
import { ReactRouterProvider } from './lib/routing/react-router';

function App() {
  return (
    <ReactRouterProvider
      routes={[
        { path: '/', element: <Home /> },
        { path: '/about', element: <About /> },
      ]}
    />
  );
}
```

### Using State Management

#### Zustand
```tsx
import { createZustandStore } from './lib/store/zustand-store';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

const useUserStore = createZustandStore<UserState>({
  name: 'user-store',
  initialState: {
    user: null,
    setUser: (user) => set({ user }),
  },
  persist: true, // Optional: persist to localStorage
});

// Use in component
function Profile() {
  const { user, setUser } = useUserStore();
  // ...
}
```

#### Redux
```tsx
import { createReduxSlice, createReduxStore, ReduxProvider } from './lib/store/redux-store';

const userSlice = createReduxSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  persist: true,
});

const store = createReduxStore({
  reducer: {
    user: userSlice.reducer,
  },
});

function App() {
  return (
    <ReduxProvider store={store}>
      <YourApp />
    </ReduxProvider>
  );
}
```

### Using Forms

#### React Hook Form
```tsx
import { useForm } from './hooks/useForm';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    library: 'react-hook-form',
    validationSchema: schema,
    resolver: 'zod',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Olapat
```tsx
import { useForm } from './hooks/useForm';

function LoginForm() {
  const { register, handleSubmit, errors } = useForm({
    library: 'olapat',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## File Structure

After running the CLI, your project will have:

```
src/
├── components/        # Antd custom components
├── services/         # axiosInstant service
├── lib/
│   ├── tanstack-query.ts/js
│   ├── routing/      # Selected routing library
│   └── store/        # Selected state management
├── hooks/
│   └── useForm.ts/js # Custom form hook
└── utils/            # Utility functions
```

## Dependencies

The CLI automatically installs the required dependencies based on your selections:

- **Always**: `antd`, `@ant-design/icons`, `dayjs`, `clsx`, `axios`, `js-cookie`
- **Tanstack Query**: `@tanstack/react-query`, `@tanstack/react-query-devtools`
- **Tanstack Router**: `@tanstack/react-router`
- **React Router**: `react-router-dom`
- **Zustand**: `zustand`
- **Redux**: `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- **React Hook Form**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Olapat**: `olapat`

## Customization

### Custom Axios Base URL

```tsx
import { axiosInstant } from './services';

axiosInstant.setBaseURL('https://api.example.com');
```

### Custom Theme

The Antd and Tailwind themes are already customized. You can further customize them in:
- `tailwind.config.js` - Tailwind theme
- `CustomConfigProvider` - Antd theme

## Notes

- All features are optional - select only what you need
- The CLI converts TypeScript to JavaScript if you select JS
- Dependencies are automatically installed based on your selections
- Files are copied with the correct extensions (.ts/.js, .tsx/.jsx)

