# ATS Resume Builder

A full-stack web application that allows users to create, view, and manage ATS-friendly resumes with personalized sections for skills, experience, and education. Includes user authentication and resume storage.

![ATS Resume Builder](https://via.placeholder.com/800x400?text=ATS+Resume+Builder)

## Features

- **User Authentication**
  - Secure signup and login
  - JWT token-based authentication
  - Protected routes

- **Resume Building**
  - Multi-step form with intuitive navigation
  - Personal details section
  - Education history with date selection
  - Work experience entries
  - Project showcase
  - Skills selection
  - Certifications
  - Job target section with preferred role and job description

- **Resume Management**
  - View all created resumes
  - Delete unwanted resumes
  - View detailed resume information

- **Job Application Tracker**
  - Track and manage job applications
  - Monitor application statuses like "Applied," "Interview," "Rejected," and "Offer"

- **Responsive Design**
  - Fully responsive UI for desktop and mobile devices

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Bootstrap Icons
- jQuery
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt.js for password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ats-resume-builder.git
   cd ats-resume-builder

## Install dependencies
```bash
npm install

## Create .env file

Create a .env file in the root directory with the following variables:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

## Start the server
```bash
npm start

## Open the application

Open `dashboard.html` in your web browser or use a local server to serve the HTML files.

---

# Usage Guide

## Authentication

- Sign up with a new account  
- Log in with your credentials  
- The dashboard provides access to all features  

## Dashboard

- Logged-in users can access personalized features like resume building, ATS score analysis, and job tracking.  
- Guests are prompted to log in or sign up to access advanced features.  

## Creating a Resume

- Click "Build Resume" from the dashboard  
- Complete each section of the multi-step form:
  - Personal details  
  - Educational history  
  - Work experience  
  - Projects  
  - Skills  
  - Certifications  
  - Job target  
- Submit the form to save your resume  

## Managing Resumes

- Click "My Resumes" from the dashboard  
- View all your created resumes  
- Use the "View" button to see resume details  
- Use the "Delete" button to remove resumes  

## Job Tracking

- Click "Job Tracker" from the dashboard  
- Add, edit, and manage job applications  
- Monitor application statuses  

---

# API Endpoints

## Authentication

- `POST /signup` - Register a new user  
- `POST /login` - Authenticate user and get token  

## User

- `GET /user` - Get current user information (protected)  

## Resume

- `POST /submit-resume` - Create a new resume (protected)  
- `GET /user-resumes` - Get all resumes for current user (protected)  
- `GET /resume/:id` - Get a specific resume by ID (protected)  
- `PUT /resume/:id` - Update a specific resume (protected)  
- `DELETE /resume/:id` - Delete a specific resume (protected)  

## Job Applications

- `POST /applications` - Create a new job application (protected)  
- `GET /applications` - Get all job applications for the logged-in user (protected)  
- `GET /applications/:id` - Get a specific job application by ID (protected)  
- `PUT /applications/:id` - Update a job application (protected)  
- `DELETE /applications/:id` - Delete a job application (protected)  

---



# Security Notes

- JWT authentication with expiration  
- Password hashing using bcrypt  
- Protected API endpoints  
- User-specific resume and application access control  
- Form validation for all inputs  

---

# Future Enhancements

- PDF export of resumes  
- Resume templates and themes  
- ATS score analysis  
- Resume comparison with job descriptions  
- Real-time resume editing  

---

# License

This project is licensed under the MIT License.
