# LinkSmith – URL Shortener with Analytics

LinkSmith is a URL shortening service that generates short links with real-time analytics tracking. Built with Node.js, Express, Prisma, PostgreSQL, and Redis.

---

## What It Does

- Transforms long URLs into short, shareable links
- Tracks clicks with device, browser, IP, and region analytics
- Uses Redis caching for fast redirects
- Fully containerized with Docker

---

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** Prisma 6

---

## Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Git

### 1. Clone the repository

```bash
git clone https://github.com/demilade111/LinkSmith.git
cd linksmith-backend
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/linksmith?schema=public
REDIS_URL=redis://redis:6379
PORT=3000
```

### 3. Start all services

```bash
docker-compose up --build
```

This will start:

- App on `http://localhost:3000`
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### 4. Run database migrations

```bash
docker exec linksmith_app npx prisma migrate dev
```

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1/links`

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/`                | Create a new short link        |
| GET    | `/:code`           | Redirect to original URL       |
| GET    | `/:code/analytics` | Get click analytics for a link |

---

## Usage Examples

### Create a Short Link

```bash
curl -X POST http://localhost:3000/api/v1/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.example.com/very/long/url"}'
```

**Response:**

```json
{
  "id": "cmhk3v2bm0001ph0u6wtu46ph",
  "originalUrl": "https://www.example.com/very/long/url",
  "shortCode": "ISRf4v",
  "createdAt": "2025-11-04T05:05:21.538Z"
}
```

### Redirect to Original URL

Visit the short link in your browser or use curl:

```bash
curl -I http://localhost:3000/api/v1/links/ISRf4v
```

The browser will automatically redirect to the original URL.

### Get Analytics

```bash
curl http://localhost:3000/api/v1/links/ISRf4v/analytics
```

**Response:**

```json
{
  "total": 127,
  "byRegion": {
    "US": 89,
    "NG": 23,
    "GB": 15
  },
  "byDevice": {
    "mobile": 67,
    "desktop": 54,
    "tablet": 6
  }
}
```

---

## Author

**Demi **  
Backend Developer

