# Interview Prep Tracker

A full-stack web application designed to help job seekers organize and manage their interview pipeline, track application stages, and maintain notes throughout the job search process.

**Live Demo:** [https://application-tracker-0eqd.onrender.com/](https://application-tracker-0eqd.onrender.com/) *(add your actual URL)*  
**GitHub:** [https://github.com/AaronLeviP/Application-Tracker](https://github.com/AaronLeviP/Application-Tracker)

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Design Decisions](#architecture--design-decisions)
  - [Authentication System Design](#authentication-system-design)
  - [API Design](#api-design)
  - [Security Considerations](#security-considerations)
  - [Data Flow](#data-flow)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Project Status & Roadmap](#project-status--roadmap)
- [Lessons Learned](#lessons-learned)
- [Future Enhancements](#future-enhancements)

---

## Problem Statement

Job hunting involves juggling dozens of applications across multiple companies, each at different stages of the interview process. Existing solutions like spreadsheets are tedious to maintain, while generic task managers don't capture the specific workflow of interview preparation. This application provides a purpose-built tool to track applications, manage interview stages, and organize follow-up tasks in one centralized location.

---

## Features

### Current Features
- **User Authentication**: Secure registration and login with JWT-based authentication
- **Application Tracking**: Create, read, update, and delete job applications
- **Status Management**: Track applications through stages (Applied, Phone Screen, Technical Interview, Onsite, Offer, Rejected)
- **Search & Filter**: Search by company/position and filter by application status
- **Notes & Follow-ups**: Add notes and set follow-up dates for each application
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Key Differentiators
- **Privacy-focused**: Each user sees only their own applications (user-scoped data)
- **Minimal friction**: Streamlined interface for quick data entry during active job search
- **Real-world usage**: Built to solve an actual problem I'm experiencing as a recent CS graduate

---

## Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible schema
- **Mongoose** - ODM for MongoDB with schema validation

### Security & Authentication
- **bcryptjs** - Password hashing (cost factor: 10)
- **jsonwebtoken** - JWT token generation and verification
- **CORS** - Cross-origin resource sharing configuration

### Deployment
- **MongoDB Atlas** - Cloud database hosting
- **Render** - Backend and frontend deployment
- **Git/GitHub** - Version control and CI/CD

---

## Architecture & Design Decisions

### Authentication System Design

I implemented a JWT-based authentication system after evaluating several approaches. Here's my reasoning:

#### **Token-Based vs. Session-Based Authentication**

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **JWT (Chosen)** | Stateless, scalable, works well with SPAs and mobile | Can't easily revoke, slightly larger payload | ✓ Selected |
| **Sessions** | Can invalidate immediately, smaller cookies | Requires session store (Redis), harder to scale | Not selected |

**Rationale:** For a learning project that may evolve into a mobile app, JWT provides better flexibility and is more aligned with modern API development practices.

#### **Password Security Decisions**

**Hashing Algorithm:**
- **bcrypt** with cost factor of 10
- Automatically salts passwords (prevents rainbow table attacks)
- Computationally expensive to deter brute force (each hash takes ~100ms)
- Industry-standard for password storage

**Password Requirements:**
- Minimum length: 6 characters (8+ recommended for production)
- No complexity requirements (allows passphrases per NIST guidelines)
- Maximum length: Reasonable limit to prevent DoS attacks

**Trade-off:** Simpler requirements reduce user friction while bcrypt's computational cost provides security. In production, I would increase minimum length to 8-12 characters.

#### **Token Design**

**Payload:**
```json
{
  "id": "user_mongodb_id",
  "iat": 1738598400,
  "exp": 1741190400
}
```

**Design Decision - Minimal Payload:**
- Store only user ID (not email, name, role)
- **Pros:** Smaller tokens, single source of truth in database, easier to update user info
- **Cons:** Requires database query on each authenticated request
- **Alternative considered:** Including user email/name to avoid DB lookup
- **Chosen approach:** ID-only for data consistency and security

**Token Expiration:**
- **Duration:** 30 days
- **Rationale:** Balances security (tokens eventually expire) with UX (users don't log in constantly)
- **Production consideration:** Implement refresh token pattern for tighter security

#### **Security Threat Model**

I designed the system to defend against these attack vectors:

**1. SQL/NoSQL Injection**
- **Threat:** Malicious input like `{ "email": { "$gt": "" } }`
- **Defense:** Mongoose schema validation, input type checking
- **Implementation:** Validate that email/password are strings before querying

**2. User Enumeration**
- **Threat:** Determining which emails are registered
- **Defense:** Generic error messages
- **Example:** Both "wrong email" and "wrong password" return `"Invalid email or password"`
- **Prevents:** Attackers from building lists of valid user emails

**3. Timing Attacks**
- **Threat:** Measuring response times to infer information
- **Defense:** bcrypt.compare() takes consistent time regardless of password correctness
- **Additional:** Could add artificial delays to further normalize response times

**4. Brute Force Attacks**
- **Current:** No rate limiting (acceptable for learning project)
- **Production plan:** Implement rate limiting (e.g., 5 attempts per 15 minutes per IP)
- **Consideration:** Would require Redis or similar for distributed rate limiting

**5. Token Tampering**
- **Threat:** User modifying JWT payload to access other users' data
- **Defense:** HMAC signature verification using JWT_SECRET
- **Result:** Any modification invalidates the token

**6. Password Storage**
- **Threat:** Database breach exposing passwords
- **Defense:** bcrypt hashing means even with DB access, passwords are computationally infeasible to crack
- **Implementation:** Pre-save Mongoose hook automatically hashes on user creation/password change

---

### API Design

#### **RESTful Principles**

I followed REST conventions for predictable, maintainable endpoints:

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | Authenticate and receive token | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| GET | `/api/applications` | List user's applications | Yes |
| POST | `/api/applications` | Create new application | Yes |
| PUT | `/api/applications/:id` | Update application | Yes |
| DELETE | `/api/applications/:id` | Delete application | Yes |

#### **Status Code Strategy**

Consistent HTTP status codes improve API clarity:

- **200 OK**: Successful GET/PUT requests
- **201 Created**: Successful POST (new resource created)
- **400 Bad Request**: Client error (missing fields, validation failure)
- **401 Unauthorized**: Authentication failure (wrong credentials, invalid token)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Unexpected server error

#### **Error Response Format**

Consistent error structure across all endpoints:

```json
{
  "message": "Human-readable error description"
}
```

**Design choice:** Simple, user-friendly messages rather than exposing technical details or stack traces in production.

#### **Input Validation Strategy**

**Multi-layer validation:**
1. **Frontend validation**: Immediate feedback (email format, required fields)
2. **Backend validation**: Never trust client input
3. **Database validation**: Mongoose schema constraints (required, unique, minlength)

**Rationale:** Defense in depth - frontend validation improves UX, backend validation ensures security.

---

### Data Flow

#### **Registration Flow**

```
1. User submits: name, email, password
   ↓
2. Frontend validates format and presence
   ↓
3. POST /api/auth/register
   ↓
4. Backend checks: email already exists?
   ↓
5. Create User document (password still plain text)
   ↓
6. Mongoose pre-save hook: hash password with bcrypt
   ↓
7. Save to MongoDB (hashed password stored)
   ↓
8. Generate JWT token (expires in 30 days)
   ↓
9. Return: { token, user: { id, name, email } }
   ↓
10. Frontend stores token in localStorage
   ↓
11. User automatically logged in
```

**Design Decision - Auto-login After Registration:**
- **Chosen:** Return token immediately upon registration
- **Alternative:** Require email verification before issuing token
- **Rationale:** Better UX for MVP; email verification can be added later

#### **Authenticated Request Flow**

```
1. User action (e.g., "Add Application")
   ↓
2. Frontend retrieves token from localStorage
   ↓
3. POST /api/applications
   Headers: { Authorization: "Bearer <token>" }
   ↓
4. Auth middleware extracts token from header
   ↓
5. jwt.verify(token, JWT_SECRET)
   ↓
6. Valid? Extract user ID from payload
   ↓
7. Attach to request: req.user = { id: "..." }
   ↓
8. Controller creates application with user ID
   ↓
9. Query: { user: req.user.id } (user-scoped data)
   ↓
10. Return only this user's applications
```

**Security Note:** All application queries filter by `req.user.id`, ensuring users can only access their own data.

---

### Database Schema Design

#### **User Model**

```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Design Decisions:**
- Email as primary identifier (not username) - industry standard for business apps
- Password never returned in API responses
- Timestamps for auditing user account creation

#### **Application Model**

```javascript
{
  user: ObjectId (ref: User, required),
  company: String (required),
  position: String (required),
  status: Enum (Applied, Phone Screen, Technical Interview, Onsite, Offer, Rejected),
  appliedDate: Date (default: now),
  followUpDate: Date (optional),
  notes: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Design Decisions:**
- `user` reference ensures data isolation
- Enum for `status` prevents invalid values
- `followUpDate` separate from `appliedDate` for reminder functionality
- Open-ended `notes` field for flexibility

**Relationship:**
- One-to-Many: One User → Many Applications
- Enforced at query level: `Application.find({ user: req.user.id })`

---

## Installation & Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account (or local MongoDB installation)
- Git

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/interview-prep-tracker.git
cd interview-prep-tracker/server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EOF

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

Visit `http://localhost:3000` to use the application.

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Aaron Smith",
  "email": "aaron@example.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aaron Smith",
    "email": "aaron@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "aaron@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aaron Smith",
    "email": "aaron@example.com"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aaron Smith",
    "email": "aaron@example.com"
  }
}
```

### Application Endpoints

All application endpoints require authentication (JWT token in Authorization header).

#### List Applications
```http
GET /api/applications
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": "507f1f77bcf86cd799439011",
    "company": "Google",
    "position": "Software Engineer",
    "status": "Applied",
    "appliedDate": "2025-01-15T00:00:00.000Z",
    "followUpDate": "2025-01-22T00:00:00.000Z",
    "notes": "Applied through LinkedIn",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

#### Create Application
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Microsoft",
  "position": "Backend Engineer",
  "status": "Applied",
  "notes": "Referral from John",
  "followUpDate": "2025-02-10"
}
```

#### Update Application
```http
PUT /api/applications/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Phone Screen",
  "notes": "Scheduled for Friday 2pm"
}
```

#### Delete Application
```http
DELETE /api/applications/:id
Authorization: Bearer <token>
```

---

## Project Status & Roadmap

### ✅ Completed (Phase 1)
- [x] User authentication (register, login, JWT)
- [x] CRUD operations for applications
- [x] User-scoped data (privacy/isolation)
- [x] Search by company/position
- [x] Filter by status
- [x] Responsive UI design
- [x] Input validation (frontend & backend)
- [x] Error handling
- [x] MongoDB Atlas integration
- [x] Deployment to Render

### 🚧 In Progress (Phase 2)
- [ ] Password reset via email
- [ ] Email verification for new accounts
- [ ] Rate limiting for auth endpoints

### 📋 Planned (Phase 3)
- [ ] Application statistics dashboard
- [ ] Email reminders for follow-ups
- [ ] Export data (CSV/PDF)
- [ ] Tagging system for applications
- [ ] Interview question bank per company
- [ ] Chrome extension for quick job posting capture

---

## Lessons Learned

### Technical Insights

**1. Async/Await and Promise Management**
- Initial challenge: Understanding when to use `await` and how Mongoose middleware handles async operations
- Solution: Learned that Mongoose 7+ doesn't require `next()` callback in async pre-save hooks
- Takeaway: Read library documentation for version-specific patterns

**2. JWT vs Sessions Trade-offs**
- Explored both approaches before implementation
- Decision to use JWT was based on statelessness and alignment with modern SPA architecture
- Recognized that refresh token pattern would be necessary for production-grade security

**3. Password Hashing Pre-Save Hook**
- Initially called `next(error)` in async function, causing "next is not a function" error
- Root cause: Mongoose 7 handles Promise rejection automatically in async middleware
- Solution: Remove `next` parameter and rely on Promise-based error handling
- Lesson: Framework version matters—patterns from tutorials may be outdated

**4. Security Through Generic Error Messages**
- Counterintuitive to hide specific error details from users
- Understanding that revealing "email not found" vs. "wrong password" enables user enumeration attacks
- Balancing security best practices with developer-friendly error messages for debugging

**5. CORS Configuration Complexity**
- Initially hit CORS errors when adding Authorization headers
- Learned that preflight OPTIONS requests require explicit header allowlisting
- Solution: Configure `allowedHeaders: ['Authorization', 'Content-Type']` in CORS options
- Takeaway: CORS is more than just setting `origin`—headers and methods matter

### Development Process Insights

**1. Design Before Code**
- Investing time in API design and threat modeling upfront saved debugging time later
- Created comprehensive requirement analysis before writing authentication system
- Result: Cleaner code, fewer refactors, easier to explain design decisions

**2. Incremental Building with Testing**
- Built authentication in stages: password hashing → comparison → token generation → middleware
- Tested each piece in isolation before integration
- Used temporary test routes to verify behavior before connecting to frontend

**3. Documentation as Learning Tool**
- Writing this README forced me to articulate *why* I made each decision
- Explaining trade-offs deepened my understanding of the technology choices
- Realized that good documentation is a sign of understanding, not just communication

---

## Future Enhancements

### Security Improvements
- [ ] Implement rate limiting (via express-rate-limit or Redis)
- [ ] Add refresh token rotation
- [ ] Implement logout (token blacklist with Redis)
- [ ] Add CSRF protection for cookie-based auth (if switching from JWT)
- [ ] Set up security headers (helmet.js)
- [ ] Implement account lockout after N failed login attempts

### Feature Additions
- [ ] Email notifications for upcoming follow-ups
- [ ] Integration with job boards (LinkedIn, Indeed) via API
- [ ] Collaborative features (share applications with career counselors)
- [ ] Analytics: response rate, time-to-offer, etc.
- [ ] Mobile app (React Native) using same backend API
- [ ] Browser extension to quickly save job postings

### Technical Debt
- [ ] Add comprehensive test suite (Jest, Supertest)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Implement logging (Winston, Morgan)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Database migration strategy for schema changes
- [ ] Performance optimization (database indexing, query optimization)

---

## Author

**Aaron** - Recent Computer Science Graduate  
Actively seeking IT Operations and Software Engineering roles in NYC/Long Island area

- [LinkedIn](https://www.linkedin.com/in/aaronlevip/)
- [GitHub](https://github.com/AaronLeviP)

---

## Acknowledgments

- **Claude (Anthropic)** for technical guidance and code review
- **MongoDB University** for database design best practices
- **OWASP** for security guidelines and threat modeling resources

---

## License

This project is open source and available under the [MIT License](LICENSE).

