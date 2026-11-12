# 🔄 SkillSwap — Student Skill Exchange Platform

**SkillSwap** is a full-stack peer-to-peer web application designed for campus students to exchange skills without financial barriers. Rather than paying costly tutors or studying in isolation, students list skills they can teach and skills they want to learn. SkillSwap's core feature is its **Smart Reciprocal Matching Engine**, which automatically identifies and suggests mutual 1:1 learning partnerships between students.

---

## 🌟 Key Features

- **🎓 Peer-to-Peer Student Exchange:** Trade knowledge in coding, UI/UX design, languages, mathematics, audio production, and academics.
- **🔄 Smart Reciprocal Matching (`/api/matches`):** Automatically matches student *A* (offers $X$, wants $Y$) with student *B* (offers $Y$, wants $X$) using clean, case-insensitive, trimmed bidirectional pairing.
- **⚡ Interactive Reciprocal Match Hub:** High-impact visual comparisons of paired syllabi with one-click exchange proposals.
- **🔍 Comprehensive Search & Filters:** Filter listings by keyword, skill, level (*beginner*, *intermediate*, *advanced*), and availability (*open*, *matched*).
- **📬 Exchange Requests Workflow:** Send proposals with custom messages, track inbound and outbound requests, and accept or decline requests.
- **🤝 Contact Revelation on Match:** Once an exchange request is accepted, mutual contact details and emails are revealed to coordinate study sessions.
- **🔐 Secure JWT Authentication:** User authentication with encrypted passwords via `bcryptjs` and session tokens via `jsonwebtoken`.
- **🛡️ Robust Dual Validation:** Strict schema validation with `express-validator` on the backend and interactive feedback on the frontend.
- **✨ One-Click Demo Accounts:** Test reciprocal match pairs instantly directly from the login page!

---

## 🏗️ Architecture & Tech Stack

```
SkillSwap/
├── client/                     # Frontend (React 18 + Vite + React Router + Tailwind CSS)
│   ├── src/
│   │   ├── api/                # API client & endpoint services
│   │   ├── components/         # Reusable UI components & navigation
│   │   ├── context/            # AuthContext & real-time badge counts
│   │   ├── pages/              # Route views (Home, Explore, Matches, Listings, Requests, Profile)
│   │   ├── App.jsx             # React Router structure
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                     # Backend (Node.js + Express REST API + MongoDB Mongoose)
│   ├── src/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Auth, Listing, Match, and Request controllers
│   │   ├── middleware/         # JWT protection, request validation, error handler
│   │   ├── models/             # User, Listing, and ExchangeRequest Mongoose models
│   │   ├── routes/             # Express API routes
│   │   ├── scripts/            # Database seeder with reciprocal match pairings
│   │   ├── app.js              # Express application setup & CORS
│   │   └── server.js           # Server entry point
│   ├── test/                   # Automated unit & integration tests
│   ├── .env.example
│   └── package.json
│
└── README.md                   # Project documentation & setup instructions
```

---

## 📦 Database Models

### 1. `User`
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Full name of the student |
| `email` | String | Unique campus email (lowercase, indexed) |
| `password` | String | Encrypted password (hashed with `bcryptjs`) |
| `bio` | String | Student background, major, or academic interests |
| `createdAt` | Date | Timestamp of registration |

### 2. `Listing`
| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | ObjectId | Reference to `User` |
| `skillOffered` | String | The skill or subject the student can teach |
| `skillWanted` | String | The skill or subject the student wants to learn |
| `description` | String | Detailed syllabus or exchange goals (10–1000 chars) |
| `level` | String | Enum: `beginner`, `intermediate`, `advanced` |
| `status` | String | Enum: `open`, `matched` (default: `open`) |
| `createdAt` | Date | Timestamp of creation |

### 3. `ExchangeRequest`
| Field | Type | Description |
| :--- | :--- | :--- |
| `fromUser` | ObjectId | Reference to requesting `User` |
| `toUser` | ObjectId | Reference to recipient `User` (owner of listing) |
| `listing` | ObjectId | Reference to `Listing` |
| `message` | String | Personalized message proposing schedule or topics |
| `status` | String | Enum: `pending`, `accepted`, `rejected` (default: `pending`) |
| `createdAt` | Date | Timestamp of request |

---

## 🔄 Matching Logic (Core Feature)

For any open listing created by the authenticated user with:
- **Skill Offered:** $X$
- **Skill Wanted:** $Y$

The algorithm searches all open listings created by **other students** where:
$$\text{skillOffered} \approx Y \quad \text{AND} \quad \text{skillWanted} \approx X$$

- Matches are evaluated using trimmed, case-insensitive regex matching.
- Excludes the user's own listings.
- Excludes listings marked as `matched` / closed.
- Additionally surfaces complementary listings (peers offering $Y$ or wanting $X$) so students always discover opportunities.

---

## 🚀 REST API Specification

### Authentication
- `POST /api/auth/register` — Create student account (returns JWT token and user info)
- `POST /api/auth/login` — Sign in with email and password
- `GET /api/auth/me` — Retrieve authenticated user profile (Private)

### Listings
- `GET /api/listings` — Browse all listings (supports `?search=`, `?skill=`, `?level=`, `?status=`, `?user=`)
- `POST /api/listings` — Create a new skill listing (Private)
- `GET /api/listings/:id` — Get single listing details with populated author info
- `PUT /api/listings/:id` — Update listing (Private, Owner only)
- `DELETE /api/listings/:id` — Remove listing (Private, Owner only)

### Reciprocal Matches
- `GET /api/matches` — Returns exact reciprocal match suggestions and complementary recommendations for the logged-in student (Private)

### Exchange Requests
- `POST /api/requests` — Propose an exchange request for a listing (Private)
- `GET /api/requests` — Retrieve sent and received requests (Private, optional `?type=sent|received|all`)
- `PATCH /api/requests/:id` — Accept or reject an exchange request (Private, Recipient only)

---

## 🛠️ Quick Start & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

### Step 1: Clone or Open Project
```bash
cd backend
```

---

### Step 2: Configure Environment Variables

#### Backend (`/server/.env`):
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=supersecret_jwt_key_skillswap_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/skillswap`)*

#### Frontend (`/client/.env`):
Create `client/.env` (or copy from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies

#### Install Server Dependencies:
```bash
cd server
npm install
```

#### Install Client Dependencies:
```bash
cd ../client
npm install
```

---

### Step 4: Seed Database with Demo Match Pairs

The seed script creates realistic student profiles and **exact reciprocal pairings** (Alex $\leftrightarrow$ Maya, Liam $\leftrightarrow$ Sofia, Jordan $\leftrightarrow$ Priya):

```bash
cd ../server
npm run seed
```

#### Demo User Credentials (Password for all: `password123`):
| Student | Email | Offers | Wants | Reciprocal Match Partner |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@campus.edu` | Python | Figma UI/UX | **Maya Lin** |
| **Maya Lin** | `maya@campus.edu` | Figma UI/UX | Python | **Alex Rivera** |
| **Liam Chen** | `liam@campus.edu` | Calculus | Spanish | **Sofia Rodriguez** |
| **Sofia Rodriguez** | `sofia@campus.edu` | Spanish | Calculus | **Liam Chen** |
| **Jordan Taylor** | `jordan@campus.edu` | Music Production | React | **Priya Patel** |
| **Priya Patel** | `priya@campus.edu` | React | Music Production | **Jordan Taylor** |

---

### Step 5: Run Automated Tests

Run backend unit and integration test suite:
```bash
cd server
npm test
```
*Tests verify reciprocal matching logic, self-exclusion, case-insensitivity, bcrypt hashing, and JWT signing.*

---

### Step 6: Start Application

#### 1. Start Express Backend:
```bash
cd server
npm start
# Server runs at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

#### 2. Start Vite React Frontend:
In a separate terminal window:
```bash
cd client
npm run dev
# Vite dev server runs at http://localhost:5173
```

Open your browser to `http://localhost:5173` to explore SkillSwap!

---

## 🧪 Testing the Matching Feature

1. Navigate to `http://localhost:5173/login`.
2. Click the quick demo button for **Alex Rivera** (`alex@campus.edu` / `password123`) and log in.
3. Click on the **Smart Matches** tab in the navigation bar.
4. You will immediately see the **Reciprocal Match Found!** card pairing Alex's Python listing with Maya Lin's Figma UI/UX listing.
5. Click **"Propose Exchange with Maya"** to test sending a request.
6. Log out and sign in as **Maya Lin** (`maya@campus.edu` / `password123`).
7. Open **Requests** $\rightarrow$ **Received Requests**.
8. Click **"Accept Exchange"**! Notice that the exchange is marked accepted and contact information is unlocked to coordinate learning sessions.

#   B a c k e n d - p r o j e c t  
 