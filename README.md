**Full-Stack Library System**

A full-stack assignment built with NestJS, PostgreSQL, Prisma, and React.js (TypeScript). This system provides complete CRUD operations for Authors, Books, and Users along with Borrow/Return flows and JWT authentication.

**Features**

**Authentication:**
User Registration,
User Login,
JWT token generation,
Protected routes for CRUD operations

**Users:**
Create a new user,
List all users

**Authors:**
Create Author,
List Authors,
Edit Author,
Delete Author,

**Books:**
Add Book,
Edit Book,
Delete Book,

List Books with filters:
Search (title / isbn),
Filter by author,
Filter by borrowed status,

**Borrowing System:**
Borrow a book,
Return a book,
View current user's borrowed books,
Borrow history with timestamps,
Auto-updates availability

**Backend Setup**
1. Install Dependencies
cd backend

npm install

2. Environment Variables
Create .env file inside backend/:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/library_db"

JWT_SECRET="your_jwt_secret"

3. Run prisma Migrations
cd backend
npx prisma migrate dev
if docker => docker compose exec backend npx prisma migrate deploy

4. Start backend server
npm run start:dev

Backend runs on: http://localhost:3000

**How to get token and test protected routes:**
Getting JWT Token:

Register a user: POST -> /auth/register

Login: POST -> /auth/login

response: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."}

Using Token for protected routes:

Add this header in postman or frontend axios:

Authorization: Bearer <token>

Now you can acces:
POST /authors,
POST /books,
PUT /authors/:id,
DELETE /books/:id,
POST /borrow/:bookId, 
POST /borrow/return/:bookId,


**Docker Support**

docker compose up --build

**Demo Video**
**https://drive.google.com/file/d/1CJaN7cj9_Ddf_GWYrLiaZ8FD4OoUos3p/view?usp=drive_link**

**Assumptions:**

Only authenticated users can perform write operations (Add/Edit/Delete).

A book can be borrowed by only one user at a time.

Returning a book sets returnedAt timestamp and marks availability.

Admin functions are not implemented (scope is simple library system).

**Design Notes:**

Prisma chosen for fast schema iteration and type-safe queries.

PostgreSQL used due to relational nature of Authors–Books–Users.

Borrowing logic implemented at DB level to maintain consistency.

React uses Axios interceptor to attach JWT automatically.

Tailwind used for rapid UI development.


**Conclusion:**
This assignment implements a fully functional end-to-end library management system covering:

✔ Full-stack CRUD

✔ JWT auth

✔ Borrow/Return logic

✔ Prisma + Postgres relational models

✔ React UI with protected routes + Tailwind styling
