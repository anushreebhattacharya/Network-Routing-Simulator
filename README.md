# Network Routing Simulator

College mini project: an interactive MERN simulator for computer networks. You can draw routers and links, run Dijkstra, Bellman–Ford and BFS on the real graph, watch a packet follow the computed path, inspect routing tables, compare algorithms, and save topologies in local MongoDB.

The stack is **React + Vite + Tailwind CSS + React Flow**, **Node.js + Express**, and **MongoDB Community Server** on localhost. Nothing here requires a cloud account or a paid API.

## What it demonstrates

- Interactive topology editor (add / move / delete routers, bidirectional links, link costs)
- Three routing algorithms implemented by hand in readable JavaScript modules
- Path highlighting, visit order, playback (play / pause / step / reset) and packet animation
- Per-source routing table (destination, next hop, cost, route)
- Side-by-side algorithm comparison (path, cost, hops, visited nodes, execution time)
- REST APIs with consistent JSON errors
- Persistence of named topologies in MongoDB, plus a built-in campus demo network

Execution times are measured on the machine that runs the API. They are informational for the viva, not a definitive performance benchmark.

## Repository layout

```
backend/                 Express API
  src/algorithms/        Dijkstra, Bellman–Ford, BFS
  src/controllers/
  src/services/
  src/models/
  src/routes/
  src/middleware/
  src/config/
  tests/
frontend/                React + Vite dashboard
docker-compose.yml       Optional local app + MongoDB
```

## Windows setup (native, recommended for the viva)

### 1. Install tools

- [Node.js LTS](https://nodejs.org/) (20 or 22)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) for Windows
- Git (optional but listed in the project requirements)

During MongoDB setup, keep **Install MongoDB as a Service** enabled so it starts with Windows.

### 2. Confirm MongoDB is running

In **PowerShell**:

```powershell
Get-Service MongoDB
```

If the service exists but is stopped:

```powershell
Start-Service MongoDB
```

If you installed MongoDB without a Windows service, start it yourself (adjust the path if your install location differs):

```powershell
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### 3. Clone or open the project, then install dependencies

```powershell
cd "D:\Network Routing Simulator"
npm install
npm run install:all
```

Copy environment templates if `.env` files are missing:

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Default values already point at localhost:

- API: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- MongoDB: `mongodb://127.0.0.1:27017/network_routing_simulator`

### 4. Start the app

From the project root (runs API and Vite together):

```powershell
cd "D:\Network Routing Simulator"
npm run dev
```

Or two terminals:

```powershell
cd "D:\Network Routing Simulator\backend"
npm run dev
```

```powershell
cd "D:\Network Routing Simulator\frontend"
npm run dev
```

Open **http://localhost:5173**.

### 5. Demonstrate in 60 seconds

1. Click **Load Demo Network**.
2. Source `R1`, destination `R8`.
3. Select **Dijkstra** → **Find route**.
4. Click **Play** to animate the packet.
5. Click **Compare all** and explain hops vs cost.
6. Open **Saved Networks** to show MongoDB persistence (the campus demo is seeded on API startup).

## Tests

```powershell
cd "D:\Network Routing Simulator"
npm test
```

- Backend: Vitest + Supertest (algorithms, graph validation, REST)
- Frontend: Vitest (graph helpers used by the editor and animation)

## Optional Docker Compose

Docker is optional. Use it only if you want MongoDB (and the app) in containers.

```powershell
cd "D:\Network Routing Simulator"
docker compose up --build
```

Then open http://localhost:5173. Stop with `docker compose down`.

## REST API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Process check |
| POST | `/api/algorithms/run` | Run one algorithm |
| POST | `/api/algorithms/compare` | Run Dijkstra, Bellman–Ford and BFS |
| GET | `/api/topologies` | List saved networks |
| GET | `/api/topologies/demo` | Built-in campus demo (no DB required) |
| POST | `/api/topologies` | Save a topology |
| GET | `/api/topologies/:id` | Load one saved topology |
| PUT | `/api/topologies/:id` | Update |
| DELETE | `/api/topologies/:id` | Delete |
| POST | `/api/topologies/demo/seed` | Persist the demo into MongoDB |

Run-algorithm body:

```json
{
  "algorithm": "dijkstra",
  "source": "R1",
  "destination": "R8",
  "nodes": [{ "id": "R1", "label": "R1", "position": { "x": 0, "y": 0 } }],
  "edges": [{ "id": "e1", "source": "R1", "target": "R2", "weight": 2, "bidirectional": true }]
}
```

Success responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "error": { "message", "code" } }`.

## Algorithm notes (viva)

- **Dijkstra** always chooses the currently cheapest tentative distance. Negative link weights are rejected because the algorithm is not correct on those graphs.
- **Bellman–Ford** repeats edge relaxation and then looks for a further improvement that can reach the destination — that is a reachable negative cycle, so shortest paths are undefined.
- **BFS** ignores weights while searching, so it answers “fewest hops”. The UI still shows the sum of weights on that hop path so you can compare it with Dijkstra’s cost.

Bidirectional links are the default: each undirected campus cable is stored once and expanded into two directed edges in the adjacency list.
