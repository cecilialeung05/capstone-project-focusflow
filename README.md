# FocusFlow

FocusFlow is your daily companion for maintaining focus and productivity. It combines task management, focused work sessions, and note-taking in an intuitive interface that guides you through your day.

## How FocusFlow Helps You

FocusFlow breaks down your workday into manageable steps:

1. **Plan Your Day** - Start each morning by organizing your tasks
2. **Focus Sessions** - Work in 25-minute intervals with built-in breaks
3. **Track Progress** - Monitor your accomplishments and maintain momentum
4. **Capture Ideas** - Take quick notes linked to your tasks

### Perfect For:
- Professionals managing multiple projects
- Students balancing assignments and study sessions
- Anyone looking to improve their focus and productivity

## Key Features

### 1. Guided Daily Structure
- **Morning Planning:** Quick task organization to start your day
- **Focus Timer:** 25-minute work sessions with break reminders
- **Progress Tracking:** Visual feedback on your daily accomplishments

### 2. Smart Task Management
- Create and organize tasks with priorities
- Link related notes and resources
- Track completion status and deadlines

### 3. Integrated Notes
- Capture ideas during focus sessions
- Link notes to specific tasks
- Quick-access recent notes

### 4. Focus Timer
- Customizable Pomodoro-style timer
- Automatic break reminders
- Session statistics and insights (coming soon)

## Who is FocusFlow For?

FocusFlow is designed for individuals who struggle with focus, motivation, and task organization. Whether you're a student, professional, or someone seeking a structured yet flexible workflow, FocusFlow helps you manage tasks, take meaningful breaks, and track progress without feeling overwhelmed.
---

## Features

### How It Works (A Day with FocusFlow)
- **Start Your Day →** Add tasks and jot down quick notes.
- **Stay on Track →** Use the Focus Timer to work in structured sessions.
- **Reflect & Adjust →** Log energy levels, organize notes, and review insights.
- **Stay Motivated →** Receive small motivational boosts and reminders.


### Task Management
- **Create, Edit, Delete Tasks:** Manage tasks with titles, descriptions, due dates, and statuses (open, in progress, completed).
- **Tagging and Filtering:** Easily categorize tasks with tags and filter them for better organization.

### Smart Notes (Linked to Tasks)
- **Task-Linked Notes:**  Attach and manage notes related to specific tasks to keep relevant information in one place.
- **Organize and Search:** Quickly find notes using the tagging system.

### Pomodoro-Style Focus Timer
- **Built-in Timer:** Work in structured sessions with break reminders every 25 minutes.

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

Thanks for visiting!
