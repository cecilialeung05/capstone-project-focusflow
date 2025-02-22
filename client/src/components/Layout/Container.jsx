import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RightSidebar from "./RightSidebar";
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import Dashboard from "../../pages/Dashboard";
import Notes from "../../pages/Notes";
import Tasks from "../../pages/Tasks";
import Tags from "../../pages/Tags";
import TaskDetails from "../../pages/TaskDetails";
import NoteDetails from "../../pages/NoteDetails";
import NoteForm from '../Notes/NoteForm';
import './Container.scss';

// Sample data
const sampleNotes = [
  {
    id: 1,
    title: "React Authentication Flow",
    content: `# Authentication Flow in React

## Implementation Steps
1. JWT Token Management
   - Token storage in HttpOnly cookies
   - Refresh token rotation
   - Access token expiration handling

2. Protected Routes Setup
\`\`\`jsx
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  return !loading && isAuthenticated ? children : <Navigate to="/login" />;
};
\`\`\`

3. Auth Context Implementation
\`\`\`jsx
const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {}
});
\`\`\`

Related: #authentication #react #jwt #context-api`,
    created_at: "2024-01-01T12:00:00.000Z",
    updated_at: "2024-01-01T12:00:00.000Z",
    tags: ["authentication", "react", "jwt", "context-api"]
  },
  {
    id: 2,
    title: "Express Middleware & Validation",
    content: `# Express Validation Setup

## Request Validation
\`\`\`javascript
const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
    .withMessage('Password requirements not met')
];
\`\`\`

## Common Regex Patterns
1. Email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
2. Password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]){8,}$/
3. Username: /^[a-zA-Z0-9_]{3,16}$/

## Custom Middleware
\`\`\`javascript
const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.array() });
  }
  next(err);
};
\`\`\``,
    created_at: "2024-01-02T12:00:00.000Z",
    updated_at: "2024-01-02T12:00:00.000Z",
    tags: ["express", "validation", "regex", "middleware"]
  },
  {
    id: 3,
    title: "Testing Strategy",
    content: `# Comprehensive Testing Approach

## Unit Tests (Jest & React Testing Library)
\`\`\`javascript
describe('Auth Hook', () => {
  test('login success sets user state', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login(testCredentials);
    });
    expect(result.current.user).toBeDefined();
  });
});
\`\`\`

## Integration Tests (Supertest)
\`\`\`javascript
describe('Auth API', () => {
  it('should authenticate valid user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(validCredentials);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
\`\`\`

## E2E Tests (Cypress)
\`\`\`javascript
describe('Authentication Flow', () => {
  it('should login and access protected route', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
\`\`\``,
    created_at: "2024-01-03T12:00:00.000Z",
    updated_at: "2024-01-03T12:00:00.000Z",
    tags: ["testing", "jest", "cypress", "rtl"]
  },
  {
    id: 4,
    title: "SPA Deployment Architecture",
    content: `# SPA Deployment Setup

## Frontend Deployment (React)
1. Build Optimization
   - Code splitting
   - Lazy loading
   - Asset optimization

2. CI/CD Pipeline
\`\`\`yaml
name: Deploy SPA
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm run deploy
\`\`\`

3. Environment Configuration
\`\`\`javascript
const config = {
  API_URL: process.env.REACT_APP_API_URL,
  ENV: process.env.NODE_ENV,
  VERSION: process.env.REACT_APP_VERSION
};
\`\`\`

## Backend Deployment (Express)
1. PM2 Configuration
2. Nginx Setup
3. SSL Configuration`,
    created_at: "2024-01-04T12:00:00.000Z",
    updated_at: "2024-01-04T12:00:00.000Z",
    tags: ["deployment", "ci-cd", "devops", "spa"]
  },
  {
    id: 5,
    title: "Security Best Practices",
    content: `# Security Implementation

## Frontend Security
1. XSS Prevention
   - Content Security Policy
   - Input sanitization
   - HttpOnly cookies

2. CSRF Protection
\`\`\`javascript
app.use(csurf());
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
\`\`\`

3. Rate Limiting
\`\`\`javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
\`\`\`

## Security Headers
\`\`\`javascript
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true
}));
\`\`\``,
    created_at: "2024-01-05T12:00:00.000Z",
    updated_at: "2024-01-05T12:00:00.000Z",
    tags: ["security", "authentication", "express", "react"]
  }
];

const sampleTasks = [
  {
    id: 1,
    title: "Implement JWT Authentication",
    description: "Set up JWT token-based authentication with refresh token rotation",
    status: "in-progress",
    created_at: "2024-01-01T12:00:00.000Z",
    updated_at: "2024-01-01T12:00:00.000Z",
    tags: ["authentication", "jwt", "security"]
  },
  {
    id: 2,
    title: "Add Form Validation",
    description: "Implement client and server-side validation using regex patterns",
    status: "todo",
    created_at: "2024-01-02T12:00:00.000Z",
    updated_at: "2024-01-02T12:00:00.000Z",
    tags: ["validation", "regex", "forms"]
  },
  {
    id: 3,
    title: "Write Integration Tests",
    description: "Create comprehensive test suite for auth flow",
    status: "completed",
    created_at: "2024-01-03T12:00:00.000Z",
    updated_at: "2024-01-03T12:00:00.000Z",
    tags: ["testing", "jest", "integration"]
  },
  {
    id: 4,
    title: "Setup CI/CD Pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    status: "todo",
    created_at: "2024-01-04T12:00:00.000Z",
    updated_at: "2024-01-04T12:00:00.000Z",
    tags: ["ci-cd", "devops", "deployment"]
  }
];

const sampleTags = [
  { id: 1, name: "authentication" },
  { id: 2, name: "react" },
  { id: 3, name: "express" },
  { id: 4, name: "jwt" },
  { id: 5, name: "validation" },
  { id: 6, name: "regex" },
  { id: 7, name: "testing" },
  { id: 8, name: "jest" },
  { id: 9, name: "cypress" },
  { id: 10, name: "rtl" },
  { id: 11, name: "deployment" },
  { id: 12, name: "ci-cd" },
  { id: 13, name: "security" },
  { id: 14, name: "middleware" },
  { id: 15, name: "context-api" },
  { id: 16, name: "forms" },
  { id: 17, name: "integration" },
  { id: 18, name: "devops" },
  { id: 19, name: "spa" }
];

function Container({ devMode = false }) {
  // Initialize state with sample data if in dev mode or use localStorage
  const [notes, setNotes] = useState(() => {
    if (devMode) return sampleNotes;
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [tasks, setTasks] = useState(() => {
    if (devMode) return sampleTasks;
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [tags, setTags] = useState(() => {
    if (devMode) return sampleTags;
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : [];
  });

  const [showQuickNotes, setShowQuickNotes] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [notes, tasks, tags]);

  // CRUD operations for notes
  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: note.tags || []
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (updatedNote) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updated_at: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // CRUD operations for tasks
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: task.tags || [],
      status: task.status || 'todo'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id 
        ? { ...updatedTask, updated_at: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Tag operations
  const addTag = (tag) => {
    setTags(prev => [...prev, { ...tag, id: Date.now() }]);
  };

  const deleteTag = (tagId) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="layout__main">
        <Header onQuickNote={() => setShowQuickNotes(true)} />
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                notes={notes}
                tasks={tasks}
                tags={tags}
              />
            } 
          />
          <Route 
            path="/notes" 
            element={
              <Notes 
                notes={notes}
                tasks={tasks}
                tags={tags}
                addNote={addNote}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            } 
          />
          <Route 
            path="/notes/:noteId" 
            element={
              <NoteDetails 
                notes={notes}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <Tasks 
                tasks={tasks}
                tags={tags}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            } 
          />
          <Route 
            path="/tasks/:taskId" 
            element={
              <TaskDetails 
                tasks={tasks}
                tags={tags}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            } 
          />
          <Route 
            path="/tags" 
            element={
              <Tags 
                tags={tags}
                notes={notes}
                tasks={tasks}
                addTag={addTag}
                deleteTag={deleteTag}
              />
            } 
          />
        </Routes>
        <Footer />
      </div>
      <RightSidebar 
        tasks={tasks} 
        notes={notes}
        updateTask={updateTask}
        updateNote={updateNote}
      />
      {showQuickNotes && (
        <QuickNotes
          onSave={(note) => {
            addNote(note);
            setShowQuickNotes(false);
          }}
          onClose={() => setShowQuickNotes(false)}
        />
      )}
    </div>
  );
}

export default Container;