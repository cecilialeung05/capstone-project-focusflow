# FocusFlow

FocusFlow is a modern productivity application that empowers users to create, manage, and track tasks and notes in one seamless interface. Built with a focus on simplicity, efficiency, and overall well-being, FocusFlow integrates an intuitive task manager, linked note-taking, a focus timer which prompts you to take a break every 25 minutes, and wellness motivational boost prompts to help you stay on track and inspired throughout your day.

---

## Features

### Task Management
- **Create, Edit, Delete Tasks:** Manage tasks with titles, descriptions, due dates, and statuses (open, in progress, completed).
- **Tagging and Filtering:** Easily categorize tasks with tags and filter them by category for better organization.

### Notes Integration
- **Task-Linked Notes:** Attach and manage notes related to specific tasks to keep relevant information in one place.
- **Organize and Search:** Quickly search and filter notes using the tagging system.

### Focus Timer
- **Built-in Timer:** Use the integrated focus timer to track work sessions. Receive prompts to take a break every 25 minutes.

### Wellness & Motivational Boost Prompts
- **Stay Inspired:** Receive periodic wellness and motivational prompts designed to provide a mental and emotional boost during work sessions.

---

## Implementation Details

### Architecture Overview

FocusFlow is designed with a modern, full-stack architecture:

#### Frontend
- **React:** A dynamic user interface built with React enables responsive and interactive design.
- **React Router DOM:** Manages smooth navigation between pages (dashboard, tasks, notes, and wellness prompts).
- **Axios & Sass:** For handling HTTP requests and style pre-processing respectively.

#### Backend
- **Node.js & Express:** A robust RESTful API built with Express.js handles server-side logic and routes.
- **Knex & MySQL:** Utilized for database management, ensuring efficient data storage and retrieval through a structured relational schema.
- **Security & Configuration:** `dotenv` manages environment variables while `cors` ensures secure cross-origin requests.

### Key Libraries & Tools
- **Framer Motion:** Adds smooth animations to enhance user experience.
- **React-Beautiful-DND:** Enables intuitive drag-and-drop functionality within the right sidebar lists.

### Data & Database Schema

FocusFlow leverages a relational database with the following key entities:
- **Tasks:** Stores task details including title, description, due date, status, and associated tags.
- **Notes:** Maintains task-linked notes, which can be created, edited, and linked to specific tasks.
- **Tags:** Supports categorization for both tasks and notes.

#### Join Tables
- **task_tags:** Associates tasks with multiple tags.
- **note_tags:** Associates notes with multiple tags.

*Visual representations of the database schema and application mockups are available in the `assets/images` directory.*

### API Endpoints

FocusFlow offers a set of RESTful endpoints for seamless interaction between the frontend and backend:

#### Tasks Endpoints
- **GET** `/tasks` – Retrieve a list of tasks (with optional tag filtering).
- **POST** `/tasks` – Create a new task with details and tags.
- **PUT** `/tasks/:id` – Update an existing task.
- **DELETE** `/tasks/:id` – Remove a task from the system.

#### Notes Endpoints
- **GET** `/notes` – Fetch all notes (filterable by task or tag).
- **POST** `/notes` – Add a new note, optionally linked to a task.
- **PUT** `/notes/:id` – Edit an existing note.
- **DELETE** `/notes/:id` – Delete a note.

#### Tags Endpoints
- **GET** `/tags` – Retrieve all available tags.
- **POST** `/tags` – Create a new tag for categorizing tasks and notes.

---

## Usage Instructions

### Installation
Clone the repository and install dependencies for both the frontend and backend:
```bash
git clone https://github.com/cecilialeung05/focusflow.git
cd focusflow
npm install

## Environment Setup
Create a `.env` file in the backend directory with the required environment variables (database credentials, port, etc.).

## Running the Application

### Backend
```bash
npm run start-server
```

### Frontend
```bash
npm run dev
```

Accessing FocusFlow
Open your browser and navigate to http://localhost:5173 to begin using the application.

