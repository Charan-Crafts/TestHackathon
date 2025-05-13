# API Service Integration

This directory contains the centralized API service for the Hackathon platform. It manages all API calls to the backend and provides a consistent interface for data fetching and state management.

## Files Overview

- `api.js` - Core API service with Axios instance configuration and service-specific endpoints
- Other service files may be added for specific domains (e.g., `hackathons.js`, `challenges.js`)

## Authentication Flow

The API service handles authentication automatically by:

1. Adding JWT tokens to requests via an Axios interceptor
2. Handling 401 unauthorized responses
3. Managing token storage in localStorage

## Usage Examples

### Basic API Usage

```javascript
import API from '../services/api';

// Making a direct API call
const fetchData = async () => {
  try {
    const response = await API.get('/some-endpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

### Using Service Methods

```javascript
import { authAPI } from '../services/api';

// Login example
const handleLogin = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Using with React hooks

```javascript
import { useApi } from '../hooks/useApi';
import { userAPI } from '../services/api';

const MyComponent = () => {
  const { loading, error, data, executeApiCall } = useApi();

  // Fetch users on component mount
  useEffect(() => {
    executeApiCall(() => userAPI.getAllUsers());
  }, [executeApiCall]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

## Error Handling

The API service includes a utility function `handleApiError` that standardizes error responses. It extracts relevant information from Axios errors and provides a consistent error object structure.

## Authentication Context

The API service works together with the `AuthContext` to manage user authentication state. The auth context uses the auth API methods to:

1. Register new users
2. Authenticate existing users
3. Manage user sessions
4. Handle user profile updates

## Configuration

The API base URL is configured from environment variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

If not provided, it defaults to `http://localhost:5000/api`. 