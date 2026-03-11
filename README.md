# 🚗 ServiceStation

**ServiceStation** is a web application designed to support the operations of car service stations. The system provides an intuitive interface for users, mechanics, and administrators to manage profiles, vehicles, services, and orders.

## 🛠️ Key Features

- 🔐 User authentication and authorization (including Google OAuth)
- 👤 Profile management
- 🚙 Vehicle management (add, view, edit)
- 🧾 View service history
- 📅 Online service booking
- 🧰 Service management (create, update, delete)
- 📦 Order management (status updates, filtering, assignment)
- 👥 Role-based user management

## 🧑‍💻 Technologies Used

- **Frontend:** React
- **Backend:** NestJS
- **Database:** PostgreSQL
- **OAuth Integration:** Google
- **Image Hosting:** ImgBB
- **Architecture:** Client-Server, REST API

## 📊 Diagrams

For a detailed overview of the system's structure and components, please refer to the `docs/diagrams/` folder.

## 📄 Additional document
Also you can check explanatory note to course work (Ukrainian): Курсова робота.pdf.

## 🚀 Running the Project Locally

1. Clone the repository:

```bash
git clone https://github.com/JessFreak/ServiceStation.git
cd ServiceStation
```

2. Fill all env variables.
3. Install all dependencies:

```bash
npn istall
```

3. Run the project:

```bash
npn start
```

## Infrastructure & Production-Grade Features (Lab 0)

This section documents the implementation of the "Level 2" requirements for the project infrastructure.

### Environment Variables

The application requires the following environment variables to be configured.

#### Backend (`back/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `1234` |
| `DB_HOST` | Database host (Docker service name or localhost) | `db` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `service_station` |
| `DATABASE_URL` | Full Prisma connection string | `postgresql://user:pass@host:port/db?schema=public` |
| `PORT` | Backend server port | `8080` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | `1d` |
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID | `your_id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret | `your_secret` |
| `GOOGLE_CALLBACK_URL` | OAuth2 Redirect URI | `http://localhost:8080/auth/google/callback` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

#### Frontend (`front/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8080` |
| `REACT_APP_IMGBB_API_KEY` | API Key for image hosting | `your_imgbb_key` |

---

### 🩺 Health Checks
The application provides a deep health check endpoint at `/health` to verify system integrity.

* **Status 200 (OK):** Returned when both the HTTP server and the PostgreSQL database connection are healthy.
    ![img.png](docs/images/healthSuccess.png)
* **Status 503 (Service Unavailable):** Returned when the database connection is lost or the service is degraded.
    ![img.png](docs/images/healthUnavailable.png)

---

### 📝 Structured Logging (JSON)
Logs are output to `STDOUT` in structured JSON format, enabling machine-readability for log aggregators (ELK, Prometheus). Each log contains mandatory `timestamp`, `level`, and `message` fields.

**Example Logs:**
```json
[0] {"level":"INFO","timestamp":"2026-03-11T08:35:16.202Z","context":"NestApplication","message":"Nest application successfully started"}
[0] {"level":"INFO","timestamp":"2026-03-11T08:35:16.203Z","message":"Started server on port 8080"}
[0] {"level":"INFO","timestamp":"2026-03-11T08:35:29.736Z","req":{"method":"GET","url":"/health"},"res":{"statusCode":200},"responseTime":8,"message":"request completed"}
[0] {"level":"ERROR","timestamp":"2026-03-11T08:35:48.008Z","req":{"method":"GET","url":"/health"},"message":"Health Check has failed! {\"database\":{\"message\":\"timeout of 1000ms exceeded\",\"status\":\"down\"}}"}
[0] {"level":"INFO","timestamp":"2026-03-11T08:35:48.009Z","req":{"method":"GET","url":"/health"},"res":{"statusCode":503},"err":{"type":"Error","message":"failed with status code 503","stack":"Error: failed with status code 503\n    at onResFinished (C:\\Users\\Jess\\WebstormProjects\\ServiceStation\\node_modules\\pino-http\\logger.js:115:39)\n    at ServerResponse.onResponseComplete (C:\\Users\\Jess\\WebstormProjects\\ServiceStation\\node_modules\\pino-http\\logger.js:178:14)\n    at ServerResponse.emit (node:events:520:35)\n    at onFinish (node:_http_outgoing:1026:10)\n    at callback (node:internal/streams/writable:764:21)\n    at afterWrite (node:internal/streams/writable:708:5)\n    at afterWriteTick (node:internal/streams/writable:694:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:89:21)"},"responseTime":1013,"message":"request errored"}
```

### 🛑 Graceful Shutdown
The backend application is configured to handle `SIGTERM` (sent by Docker/Kubernetes) and `SIGINT` (sent via CTRL+C) signals to ensure no data loss or interrupted requests during deployment or scaling.

* **Shutdown Process:**
1. **Signal Interception:** The app catches the termination signal.
2. **Logging:** A JSON-structured log is emitted: `"message": "SIGINT/SIGTERM received. Starting graceful shutdown..."`.
3. **Request Draining:** NestJS stops accepting new connections and finishes processing in-flight HTTP requests.
4. **Database Cleanup:** All active PostgreSQL connections are closed via Prisma's `onModuleDestroy` hook.
5. **Clean Exit:** The process exits with code 0.

**Verification Screenshot:**
![img.png](docs/images/Shutdown.png)

