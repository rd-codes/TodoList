# TodoList MERN Application
![Todo List](https://github.com/user-attachments/assets/186c94d4-ffda-4b1e-84bc-8e261d9ae0d9)

A modern, feature-rich Todo List application built with the MERN stack (MongoDB, Express, React, Node.js).

# Demo
https://github.com/user-attachments/assets/8041d2f0-a322-4507-95b4-fdc70af694d4


## Features

- **Task Management**: Create, read, update, and delete tasks
- **Categories**: Organize tasks by categories
- **Priority Levels**: Mark tasks as high, medium, or low priority
- **Due Dates**: Set due dates for tasks
- **Search**: Search through your tasks
- **Filtering**: Filter tasks by status (All, Active, Completed)
- **Sorting**: Sort tasks by creation date, priority, or due date
- **Statistics**: View task statistics (total, active, completed, high priority)
- **Responsive Design**: Works well on desktop and mobile devices
- **Light/Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React, Vite, CSS3
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **API**: RESTful API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TodoList.git
   cd TodoList
   ```

2. Install backend dependencies:
   ```
   cd Server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../todolist
   npm install
   ```

## Running the Application

1. Start MongoDB:
   ```
   # Make sure MongoDB is running on your system
   ```

2. Start the backend server:
   ```
   cd Server
   npm start
   ```

3. Start the frontend development server:
   ```
   cd todolist
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
TodoList/
├── Server/             # Backend code
│   ├── index.js        # Server entry point
│   ├── package.json    # Backend dependencies
│   └── ...
├── todolist/           # Frontend code
│   ├── src/            # Source files
│   │   ├── App.jsx     # Main App component
│   │   ├── Home.jsx    # Home component
│   │   ├── Home.css    # Styles for Home component
│   │   └── ...
│   ├── public/         # Public assets
│   ├── package.json    # Frontend dependencies
│   └── ...
└── README.md           # Project documentation
```

## API Endpoints

- `GET /todos` - Get all todos (with optional filtering, searching, and sorting)
- `POST /add` - Add a new todo
- `PUT /todo/:id` - Update a todo
- `DELETE /todo/:id` - Delete a todo
- `GET /categories` - Get all categories
- `GET /stats` - Get todo statistics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MongoDB for the database
- Express for the web framework
- React for the frontend library
- Node.js for the runtime environment 
