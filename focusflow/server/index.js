import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


app.use("/notes", notesRoutes)
app.use("/tags", tagsRoutes)
app.use("/tasks", tasksRoutes)

// Routes
app.get("/", (req, res) => {
  res.send("FocusFlow Backend Running! 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
