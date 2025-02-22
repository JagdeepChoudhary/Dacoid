# Quiz Platform

A full-featured Quiz Platform that allows users to create quizzes, attempt quizzes, view attempted quizzes, and manage created quizzes. The platform includes authentication, quiz creation, quiz attempts, and detailed result views.

## 🚀 Features

- User Authentication (Sign Up, Login, Logout)
- Create Quizzes with Multiple-Choice and Numeric Questions
- Attempt Quizzes with Timer and Instant Feedback
- View Quiz Results with Correct/Incorrect Answers
- Manage Created Quizzes (View & Delete)
- Protected Routes and Role-Based Access
- Light/Dark Theme Toggle

## 🛠️ Tech Stack

**Frontend:** React, Remix, ShadCN UI, Axios, Sonner (for toasts), Tailwind CSS

**Backend:** Node.js, Express, MongoDB, Mongoose

**Authentication:** JWT (stored in cookies)

**UI Components:** ShadCN UI, Lucide Icons

## 📂 Folder Structure

```
├── server                    # Backend (Express Server)
│   ├── controller            # API Controllers
│   ├── models                # Mongoose Models
│   ├── routes                # API Routes
│   ├── middleware            # Auth Middleware
│   └── .env                  # Environment Variables
│
├── client                    # Frontend (React Application)
│   ├── src
│   │   ├── components        # Reusable UI Components
│   │   ├── pages             # Application Pages
│   │   ├── assets            # Static Files & Images
│   │   ├── App.jsx           # Main App Component
│   │   ├── index.jsx         # Application Entry Point
│   │   └── routes.js         # Application Routes
│   └── .env                  # Environment Variables
│
└── README.md                 # Project Documentation
```

## ⚙️ Installation

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/quiz-platform.git
cd quiz-platform
```

### 2. Install Dependencies

```sh
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in both `server` with the following variables:

**Server `.env`:**

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SALT=your bcrypt Salt
```

**Client `.env`:**

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Start the Application

```sh
# Start the server
cd server
npm run dev

# Start the client
cd ../client
npm run dev
```

### 5. Open in Browser

```
http://localhost:5173
```

## 🧪 Testing

- Use Postman or browser to test the API endpoints
- Run quizzes on the frontend to test user flows

## 📦 API Endpoints

### **Authentication**

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/auth/logout`: Log out the user

### **Quizzes**

- `POST /api/quiz/create`: Create a new quiz
- `GET /api/quiz/:id`: Get quiz details
- `POST /api/quiz/attempt`: Submit a quiz attempt
- `GET /api/quiz/myquizzes`: Get quizzes created by the logged-in user

### **Attempts**

- `GET /api/attempts`: Get all quiz attempts by the logged-in user
- `GET /api/attempts/:attemptId`: Get details of a specific attempt

## 📮 Feedback

If you encounter any issues or have suggestions, please feel free to open an issue or submit a pull request.

## 👨‍💻 Author

- **Your Name** - [Your GitHub Profile](https://github.com/JagdeepChoudhary)

## 📄 License

This project is licensed under the MIT License.

---

Enjoy using the Quiz Platform! 🎉
