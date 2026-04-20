# HTTP Client

Internal abstraction for HTTP requests within the Infrastructure layer.

## When to Create This Abstraction

**Create an HttpClient when:**

1. **You need HTTP interceptors**
   - Authentication headers
   - Request/response logging
   - Error handling

2. **You need advanced features**
   - Retry logic with exponential backoff
   - Request cancellation
   - Request timeouts
   - Request deduplication

3. **You plan to swap HTTP libraries**
   - fetch → axios
   - axios → got
   - Any other swap

4. **Multiple API clients need shared behavior**
   - Same auth mechanism for all APIs
   - Same error handling strategy
   - Same retry logic

**Don't create it when:**

- Simple fetch calls suffice
- No special HTTP handling needed
- Only one API client exists
- You won't swap libraries

## Why Internal (Not a Port)

**HttpClient is NOT a port because:**

1. **Application layer doesn't care**
   - Business logic shouldn't know about HTTP libraries
   - Only cares about getting Pokemon data, not how it's fetched

2. **It's infrastructure plumbing**
   - Like database drivers, caching libraries
   - Implementation detail, not business concern

3. **Keeps architecture simple**
   - Fewer ports = less complexity
   - Repository is the meaningful boundary

## Structure

```
src/infrastructure/http/
├── HttpClient.ts              # Interface (internal)
├── FetchHttpClient.ts         # fetch implementation
└── AxiosHttpClient.ts         # axios implementation (optional)
```

## Usage

**In API Clients (Infrastructure only):**

```typescript
export class PokeApiClient {
  constructor(private http: HttpClient) {}
  
  async fetchById(id: number) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  }
}
```

**In Composition Root:**

```typescript
// Option 1: fetch (default)
const httpClient = new FetchHttpClient()

// Option 2: axios (if needed)
// const httpClient = new AxiosHttpClient()

const apiClient = new PokeApiClient(httpClient)
const repository = new PokemonRepositoryImpl(apiClient)
```

## Implementation

### FetchHttpClient (Default)

```typescript
export class FetchHttpClient implements HttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }
}
```

### AxiosHttpClient (Optional)

```typescript
import axios from 'axios'

export class AxiosHttpClient implements HttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await axios.get(url)
    return response.data
  }
}
```

## Decision Tree

```
Need to make HTTP calls?
├── Simple fetch calls, no special needs?
│   └── Use fetch directly in API client
├── Need interceptors, retries, or cancellations?
│   └── Create HttpClient abstraction
└── Using multiple HTTP libraries?
    └── Create HttpClient with multiple implementations
```

## Examples

### With Interceptors

```typescript
export class HttpClientWithAuth implements HttpClient {
  constructor(private baseClient: HttpClient, private token: string) {}
  
  async get<T>(url: string): Promise<T> {
    const headers = { Authorization: `Bearer ${this.token}` }
    return this.baseClient.get(url, { headers })
  }
}
```

### With Retry Logic

```typescript
export class HttpClientWithRetry implements HttpClient {
  constructor(
    private baseClient: HttpClient,
    private maxRetries: number = 3
  ) {}
  
  async get<T>(url: string): Promise<T> {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await this.baseClient.get(url)
      } catch (error) {
        if (i === this.maxRetries - 1) throw error
        await this.delay(1000 * Math.pow(2, i)) // Exponential backoff
      }
    }
    throw new Error('Max retries exceeded')
  }
}
```

## Key Points

- ✅ HttpClient stays in Infrastructure
- ✅ Never expose in Application layer
- ✅ Keep it simple unless you need features
- ✅ Repository is your public API, not HttpClient
- ✅ One line change in composition root to swap implementations
