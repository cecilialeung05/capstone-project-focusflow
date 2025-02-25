import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8081;


app.use(express.json());
app.use(cors());


app.use("/notes", notesRoutes)
app.use("/tags", tagsRoutes)
app.use("/tasks", tasksRoutes)

app.get("/", (req, res) => {
  res.send("FocusFlow Backend Running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
