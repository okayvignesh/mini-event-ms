# Mini Event Platform (Monorepo)

Live Demo: [https://minievent.domainrental.in/](https://minievent.domainrental.in/)

This repository contains both the **frontend** (Next.js) and **backend** (Node.js + Express) for the Mini Event Platform.

---

## 📂 Project Structure

root/
├─ backend/ # Node.js + Express API server
├─ frontend/ # Next.js frontend application
└─ README.md # Project documentation

yaml
Copy code

---

## 🚀 Frontend (Next.js)

- Built with **Next.js** (React framework).
- Hosted on **Vercel** for fast global deployment.
- Uses environment variables for API configuration.

### Running locally
```bash
cd frontend
npm install
npm run dev
Frontend will start on: http://localhost:3000

⚡ Backend (Node.js + Express)
Built with Node.js + Express.

Uses MongoDB as the database (can be Dockerized or hosted on MongoDB Atlas).

Runs behind Docker in production.

Running locally
bash
Copy code
cd backend
npm install
npm run dev
Backend will start on: http://localhost:4002




🔑 Environment Variables
Create a .env file in both backend/ and frontend/ with the following:




Backend .env
env
Copy code
MONGODB_URI=mongodb://localhost:27017/mini_event_ms
PORT=4002
JWT_SECRET=your_secret_key





Frontend .env.local
env
Copy code
NEXT_PUBLIC_API_URL=https://api.domainrental.in
🐳 Docker (Backend)
To run backend in Docker:



bash
Copy code
cd backend
docker build -t mini-event-backend .
docker run -d --name backend -p 4002:4002 --env-file .env mini-event-backend




🌐 Deployment
Frontend (Next.js) → Hosted on Vercel

Backend (Express) → Hosted on Oracle Ampere server using Docker + Nginx reverse proxy

🔗 Live Links
Frontend: https://minievent.domainrental.in/

Backend API: https://event.domainrental.in/

Swagger API Docs: https://event.domainrental.in/api-docs/
