# MVP FocusFlow: Your All-in-One Productivity Manager 

## Overview

FocusFlow is a modern productivity tool designed to allows users to create, organize, and track their tasks and ideas, helping them stay focused and productive.

## Problem Space

Existing task managers can be too complex or lack proper note-taking integration. FocusFlow solves this by combining both in a seamless experience, eliminating the need for multiple apps.

## User Profile

This app is designed for individuals who:
- Need an intuitive task management system.
- Want to combine notes and tasks in one platform.

## Features

1️. **Task Management (To-Do List)**
The user can...
    *   Create, Edit, Delete Tasks: to create change to the to-do lists. Manage tasks with priority levels and deadlines.
    *   Tagging System: Assign categories to tasks (e.g., Work, Personal, Study).
    *   Update A Tasks' Status: Track progress and completion rates.
    *   Tag Filtering & Search: Filter tasks by tags and search for specific tasks.

2. **Notes Organization (Linked to Tasks & Standalone)**
The user can...
    *   Create, Edit, Organize Notes: Change the context of the notes and ideas.
    *   Task-Linked Notes: Attach notes to specific tasks to keep related information in one place.
    *   Tag Filtering & Search: Search and filter notes based on tags or keywords.

3️. **Focus Timer**
The user can...
    *   use a Pomodoro Timer: Track work sessions to improve focus and productivity.

4. **Progress Insights**
    *   Basic Analytics: Track task completion trends using visual charts.

5️. **Weather Tracker**
    *   Weather Tracker: Display current conditions.

## Implementation

### Tech Stack
*   **Frontend:** 
    *   React (JavaScript library for building user interfaces)
    *   React Router DOM (for navigation)
    *   Axios (for making HTTP requests to the backend)
    *   Sass (for CSS pre-processing)

*   **Backend:** 
    *   Node.js (JavaScript runtime environment)
    *   Express.js (web application framework for Node.js)
    *   Knex.js (SQL query builder)
    *   MySQL (relational database)
    *   dotenv (for managing environment variables)
    *   cors (for handling Cross-Origin Resource Sharing)

### Libraries
    *   Framer Motion (animations)
    *   Recharts (data visualization)
    *   React-Beautiful-DND (drag-and-drop tasks)

### APIs

*   This application does not rely on external APIs. All data is managed within the internal database.

### Sitemap

*   **/dashboard:** Overview of tasks, focus timer, etc.

*   **/tasks:** Add, edit, and organize tasks.
    Subpages:
        *   **/tasks/:taskId:** Displays the details of a specific task.
        *   **/tasks/add:** Allows users to create a new task.
        *   **/tasks/:taskId/edit:** Allows users to edit an existing task.

*   **/notes:** Write and organize notes separately from tasks.
    Subpages:
        *   **/notes/:noteId:** Displays the details of a specific note.
        *   **/notes/add:** Allows users to create a new note.
        *   **/notes/:noteId/edit:** Allows users to edit an existing note.
        
*   **/tags:** Allows users to manage tags (create, edit, delete).
*   **/insights:** Visualizations of productivity and trends.
*   **/weather:** Displays current weather.
*   **/settings:** Light and Dark theme. 

### Mockups
#### Dashboard Page
![](image-1.png)

#### Tasks List Page
![](image-2.png)

#### Add and Edit Tasks Page
![](image-3.png)

#### Notes List Page
![](image-4.png)

#### Add and Edit Notes Page
![](image-5.png)

#### All Tags Page
![](image-6.png)

#### Insights, Weather and Settings Page 
![](image-7.png)



## Database Schema
![DatabaseSchema](image.png)
- Tasks relate One-to-Many with Notes.
- Tasks and Tags relate Many-to-Many via task_tags.
- Notes and Tags relate Many-to-Many via note_tags.
- Weather, Timer and User Preferences are standalone tables.

### Data
*   **Tasks:**
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `title` (VARCHAR, Not Null)
    *   `description` (TEXT)
    *   `status` (ENUM ['open', 'in progress', 'completed' ], Default: 'open')
    *   `due_date` (DATE)
    *   `priority` (INT)
    *   `position` (INT, Default: 0)
    *   `created_at` (TIMESTAMP)
    *   `updated_at` (TIMESTAMP)
*   **Notes:**
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `task_id` (INT, Foreign Key referencing `tasks.id`, Nullable)
    *   `title` (VARCHAR, Not Null)
    *   `content` (TEXT, Not Null)
     *   `is_standalone` (BOOLEAN, Default: false)
    *   `created_at` (TIMESTAMP)
    *   `updated_at` (TIMESTAMP)
*   **Tags:**
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `name` (VARCHAR, Not Null, Unique)
    *   `created_at` (TIMESTAMP)
    *   `updated_at` (TIMESTAMP)
*   **task\_tags (Join Table):**
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `task_id` (INT, Foreign Key referencing `tasks.id`)
    *   `tag_id` (INT, Foreign Key referencing `tags.id`)
    *   `UNIQUE (task\_id, tag\_id)`
    *    `created_at` (TIMESTAMP)
*   **note\_tags (Join Table):**
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `note_id` (INT, Foreign Key referencing `notes.id`)
    *   `tag_id` (INT, Foreign Key referencing `tags.id`)
    *   `UNIQUE (note\_id, tag\_id)`
    *   `created_at` (TIMESTAMP)

- **Weather**: { location, temperature }.
- **User Preferences**: { theme }.

### Endpoints
**Tasks:**
*   `GET /api/tasks`
    *   Description: Get all tasks, sorted by position.
    *   Response:
    ```json
    [
        {
            "id": 1,
            "title": "Plan Website Redesign",
            "description": "Outline the new design for the company website.",
            "status": "in progress",
            "due_date": "2024-01-15",
            "priority": 1,
            "position": 0,
            "created_at": "2023-10-27T10:00:00.000Z",
            "updated_at": "2023-10-27T10:00:00.000Z"
        },
        // ... other tasks
    ]
    ```

*   `GET /api/tasks/:id`
    *   Description: Get a specific task by ID, including associated tags.
    *   Parameters: `id` (INT)
    *   Response:
    ```json
    {
        "id": 1,
        "title": "Plan Website Redesign",
        "description": "Outline the new design for the company website.",
        "status": "in progress",
        "due_date": "2024-01-15",
        "priority": 1,
        "position": 0,
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z",
        "tags": [
            {"id": 1, "name": "Work", "created_at": "...", "updated_at": "..."},
            {"id": 5, "name": "Important", "created_at": "...", "updated_at": "..."}
        ]
    }
    ```

*   `POST /api/tasks`
    *   Description: Create a new task.
    *   Parameters: `title`, `description`, `status`, `due_date`, `priority`, `tags` (array of tag IDs)
    *   Response: (Newly created task)
    ```json
    {
        "id": 6,
        "title": "New Task Title",
        "description": "...",
        "status": "open",
        "due_date": null,
        "priority": 2,
        "position": 0,
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `PUT /api/tasks/:id`
    *   Description: Update an existing task.
    *   Parameters: `id`, `title`, `description`, `status`, `due_date`, `priority`, `tags` (array of tag IDs)
    *   Response: (Updated task)
    ```json
    {
        "id": 1,
        "title": "Updated Task Title",
        "description": "...",
        "status": "completed",
        "due_date": "2024-01-01",
        "priority": 3,
        "position": 0,
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `PUT /api/tasks/:id/position`
    *    Description: Update the position
    *   Parameters: `id`, `position`
        *  Response: (Updated Task)
            ```json
              {
              "id": 1,
              "title": "Plan Website Redesign",
              "description": "Outline the new design for the company website.",
              "status": "in progress",
              "due_date": "2024-01-15",
              "priority": 1,
              "position": 2,
              "created_at": "2023-10-27T10:00:00.000Z",
              "updated_at": "2023-10-27T10:00:00.000Z"
          },
    ```

*   `DELETE /api/tasks/:id`
    *   Description: Delete a task.
    *   Parameters: `id`
    *   Response: 204 No Content

**Notes:**
*   `GET /api/notes`
    *   Description: Get all notes, can be filtered by `taskId` or to return only standalone notes (`isStandalone=true`).
    *   Parameters: `taskId` (optional), `isStandalone` (optional, boolean)
    *   Response: (Array of notes)
    ```json
    [
        {
            "id": 1,
            "task_id": 1,
            "title": "Initial Ideas",
            "content": "Brainstorming session notes",
            "created_at": "2023-10-27T10:00:00.000Z",
            "updated_at": "2023-10-27T10:00:00.000Z"
        },
        // ... other notes
    ]
    ```

*   `GET /api/notes/:id`
    *   Description: Get a specific note by ID, including associated tags.
    *   Parameters: `id` (INT)
    *   Response:
    ```json
    {
        "id": 1,
        "task_id": 1,
        "title": "Initial Ideas",
        "content": "Brainstorming session notes",
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z",
        "tags": [
            {"id": 1, "name": "Work", "created_at": "...", "updated_at": "..."}
        ]
    }
    ```

*   `POST /api/notes`
    *   Description: Create a new note.
    *   Parameters: `task_id` (optional), `title`, `content`, `tags` (array of tag IDs)
    *   Response: (Newly created note)
    ```json
    {
        "id": 7,
        "task_id": null,
        "title": "Standalone Note",
        "content": "This is a standalone note.",
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `PUT /api/notes/:id`
    *   Description: Update an existing note.
    *   Parameters: `id`, `task_id` (optional), `title`, `content`, `tags` (array of tag IDs)
    *   Response: (Updated note)
    ```json
    {
        "id": 1,
        "task_id": 2,
        "title": "Updated Note Title",
        "content": "Updated note content.",
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `DELETE /api/notes/:id`
    *   Description: Delete a note.
    *   Parameters: `id`
    *   Response: 204 No Content

**Tags:**

*   `GET /api/tags`
    *   Description: Get all tags.
    *   Response: (Array of tags)
    ```json
    [
        {
            "id": 1,
            "name": "Work",
            "created_at": "2023-10-27T10:00:00.000Z",
            "updated_at": "2023-10-27T10:00:00.000Z"
        },
        // ... other tags
    ]
    ```

*   `GET /api/tags/:id`
    *   Description: Get a specific tag by ID.
    *   Parameters: `id` (INT)
    *   Response: (Tag object)
    ```json
    {
        "id": 1,
        "name": "Work",
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `POST /api/tags`
    *   Description: Create a new tag.
    *   Parameters: `name`
    *   Response: (Newly created tag)
    ```json
    {
        "id": 6,
        "name": "New Tag",
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `PUT /api/tags/:id`
    *   Description: Update an existing tag.
    *   Parameters: `id`, `name`
    *   Response: (Updated tag)
    ```json
    {
        "id": 1,
        "name": "Updated Tag Name",
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    }
    ```

*   `DELETE /api/tags/:id`
    *   Description: Delete a tag.
    *   Parameters: `id`
    *   Response: 204 No Content

## Roadmap

**Sprint (2 Weeks):**

*   **Week 1:**
    *   Set up the React project and basic routing.
    *   Implement routing and page navigation.
    *   Build basic UI.
    *   Implement the backend API endpoints. 
    *  Set up database schema and migrations.
*   **Week 2:**
    *   Implement task filtering, tagging, and search functionality.
    *   Develop note management (add, edit, delete, link to tasks).
    *   Implement progress insights (charts and analytics for task completion rates).
    *   Integrate focus timer.
    *   Implement weather tracker functionality.
    *   Finalize settings and personalization features.
    *   Test, refine, and deploy.

---

## Nice to haves
 *   **Custom Reminders**: Gentle nudges to encourage breaks or task transitions.
 *   **User Authentication:** Add user authentication for multi-user support.


## Future Implementations
*   **Responsive Design:** Ensure the app is fully responsive and works well on different devices.
*   AI-based task recommendations.
*   More advanced analytics for productivity insights.



