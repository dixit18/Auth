# SeePossible Backend

A modern, production-ready backend built with TypeScript, Express.js, Prisma ORM, PostgreSQL/MySQL, JWT authentication, node-cron, and nodemailer for email notifications.

## Features
- **User Signup & Login** with JWT authentication and Bcrypt password hashing
- **User status auto-activation** via cron job (node-cron)
- **Email notification** on user activation (SMTP via nodemailer)
- **Swagger API documentation** at `/api/docs`
- **Jest tests** for APIs and cron job
- **MVC folder structure** for maintainability
- **Security best practices** (Helmet, CORS, .env for secrets)
- **Dockerfile** for containerized deployment

## Folder Structure
```
backend/
  src/
    controllers/
    models/
    services/
    middlewares/
    routes/
    utils/
    config/
    jobs/
    tests/
  prisma/
  generated/
  dist/
  .env.example
  Dockerfile
  package.json
  tsconfig.json
  README.md
```

## Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
JWT_SECRET=your_jwt_secret
PORT=4000
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_email_password
SMTP_FROM=your@email.com
```

## Setup & Development
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up your database:**
   - Update `DATABASE_URL` in `.env`.
   - Run migrations:
     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```
3. **Start the server (dev mode):**
   ```bash
   npm run dev
   ```
4. **API docs:**
   - Visit [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## Testing
- Run all Jest tests:
  ```bash
  npm test
  ```

## Docker Deployment
1. **Build the Docker image:**
   ```bash
   docker build -t seepossible-backend .
   ```
2. **Run the container:**
   ```bash
   docker run --env-file .env -p 4000:4000 seepossible-backend
   ```

## API Endpoints
- `POST /api/auth/signup` — User registration
- `POST /api/auth/login` — User login
- `GET /api/auth/me` — Get current user info (JWT required)
- `GET /` — Health check

## Email Notification
- When a user is auto-activated by the cron job, an email is sent to their registered email address using the SMTP settings in `.env`.

## Security Notes
- Never commit your real `.env` file or secrets to version control.
- Use strong, unique JWT and SMTP credentials.
- Restrict CORS origins in production.

## License
MIT 