import express from "express";
import cors from "cors";
import "dotenv/config";
import notesRoutes from "./routes/notesRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));


app.use("/notes", notesRoutes)
app.use("/tags", tagsRoutes)
app.use("/tasks", tasksRoutes)


app.get("/", (req, res) => {
  res.send("FocusFlow Backend Running! 🚀");
});


app.listen(PORT, () => {
  console.log(`🚌 Server running on http://localhost:${PORT}`);
});
