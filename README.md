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

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
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

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Open the application**
   Open `login.html` in your web browser or use a local server to serve the HTML files.

## Usage Guide

### Authentication
1. Sign up with a new account
2. Log in with your credentials
3. The dashboard provides access to all features

### Creating a Resume
1. Click "Build ATS-Friendly Resume" from the dashboard
2. Complete each section of the multi-step form:
   - Personal details
   - Educational history
   - Work experience
   - Projects
   - Skills
   - Certifications
   - Job target
3. Submit the form to save your resume

### Managing Resumes
1. Click "My Resumes" from the dashboard
2. View all your created resumes
3. Use the "View" button to see resume details
4. Use the "Delete" button to remove resumes

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Authenticate user and get token

### User
- `GET /user` - Get current user information (protected)

### Resume
- `POST /submit-resume` - Create a new resume (protected)
- `GET /user-resumes` - Get all resumes for current user (protected)
- `GET /resume/:id` - Get a specific resume by ID (protected)
- `PUT /resume/:id` - Update a specific resume (protected)
- `DELETE /resume/:id` - Delete a specific resume (protected)

## File Structure

```
├── server.js           # Main server file
├── .env                # Environment variables (not tracked in git)
├── .gitignore          # Git ignore file
├── package.json        # Node.js dependencies
├── login.html          # Login page
├── signup.html         # Signup page
├── dashboard.html      # User dashboard
├── resumeBuilder.html  # Resume creation form
├── my-resumes.html     # Resume listing page
├── view-resume.html    # Resume detail view
├── script.js           # Main JavaScript for auth & dashboard
├── resumeBuilder.js    # JavaScript for resume builder
├── style.css           # Main CSS styles
└── resumeBuilder.css   # CSS for resume builder
```

## Security Notes

- JWT authentication with expiration
- Password hashing using bcrypt
- Protected API endpoints
- User-specific resume access control
- Form validation for all inputs

## Future Enhancements

- PDF export of resumes
- Resume templates and themes
- ATS score analysis
- Resume comparison with job descriptions
- Real-time resume editing

---

## License

This project is licensed under the MIT License