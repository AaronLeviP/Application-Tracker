# Interview Prep Tracker

A full-stack web application to help job seekers manage their interview pipeline, track application stages, and stay organized during the job search process.

## Problem Statement

Job hunting involves applying to dozens of companies, tracking multiple interview stages, and remembering follow-up dates. Existing solutions like spreadsheets are tedious to maintain, and generic task managers don't capture the specific workflow of interview preparation.

## Features

- Track job applications with company name, position, and application date
- Update application status (Applied, Phone Screen, Technical Interview, Onsite, Offer, Rejected)
- Add notes and follow-up reminders for each application
- Filter and search applications by status or company
- User authentication for private, personalized tracking

## Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- CSS3 for styling

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

The app will run on `http://localhost:3000`

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications for logged-in user
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Project Status

**Current Phase:** Building core CRUD functionality (Phase 1)

**Completed:**
- [x] Basic Express server setup
- [x] MongoDB connection
- [x] Application model schema
- [x] Create application endpoint
- [x] Read applications endpoint
- [x] Update application endpoint
- [x] Delete application endpoint
- [x] React frontend structure
- [x] Application form component
- [x] Application list display

**Next Steps:**
- [ ] Add authentication system
- [x] Implement filtering by status
- [ ] Add follow-up date reminders
- [ ] Deploy to production

## Lessons Learned

- Setting up CORS properly for local development
- Structuring Express routes for maintainability
- Managing React state for forms and lists

## Future Enhancements

- Email notifications for follow-ups
- Analytics dashboard (applications per week, success rate)
- Interview question bank organized by company
- Calendar integration for interview scheduling

## Author

Aaron Purnawan
[LinkedIn](https://www.linkedin.com/in/aaronlevip/) | [GitHub](https://github.com/AaronLeviP)
