# Career Sure Academy Dashboard

A comprehensive dashboard application for managing students, batches, attendance, and mock tests at Career Sure Academy.

## Features

- **Student Management**: Create, edit, and manage student profiles
- **Batch Management**: Organize students into batches for efficient management
- **Attendance Tracking**: Track and analyze student attendance
- **Mock Test Management**: Create mock tests and assign scores to students
- **Email Notifications**: Automatic emails for student registration and batch assignments
- **Student Portal**: Dedicated student login for accessing progress reports and information

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Firebase (Firestore) for main data, Node.js/Express for emails
- **Authentication**: Firebase Authentication
- **Email Service**: Nodemailer with Gmail SMTP

## Project Structure

- `/src`: React frontend application
  - `/components`: UI components
  - `/contexts`: Context providers for state management
  - `/services`: Service layer for API communication
  - `/pages`: Main application pages
- `/backend`: Node.js backend for email services
  - `/controllers`: API endpoint controllers
  - `/services`: Business logic services
  - `/routes`: API routes
  - `/config`: Configuration files

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Firebase account
- Gmail account for sending emails

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your Firebase credentials
4. Start the development server:
   ```
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your Gmail credentials
4. Start the backend server:
   ```
   npm run dev
   ```

## Development Notes

### Recent Updates

- **Console Log Cleanup**: Removed all `console.log` statements from the codebase for production readiness while preserving necessary `console.error` statements for error logging.
- **Email Service Improvements**: Enhanced error handling in the email service for better reliability.
- **Performance Optimizations**: Reduced unnecessary re-renders and improved data loading performance.

### Coding Standards

- Use functional components with hooks
- Implement responsive design using Tailwind CSS
- Maintain proper error handling throughout the application
- Keep console logging to a minimum in production code
- Follow consistent code formatting using ESLint and Prettier

## Deployment

### Frontend Deployment

The frontend can be deployed to Firebase Hosting:

```
npm run build
firebase deploy --only hosting
```

### Backend Deployment

The Node.js backend can be deployed to platforms like Heroku, Vercel, or Firebase Functions.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2023 Career Sure Academy. All rights reserved.