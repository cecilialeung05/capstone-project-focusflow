import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import supabase from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use("/notes", notesRoutes);
app.use("/tags", tagsRoutes);
app.use("/tasks", tasksRoutes);

app.get("/ping", async (req, res) => {
  try {
    const { error } = await supabase.from("tags").select("*").limit(1);
    if (error) throw error;
    res.status(200).json({ message: "Supabase connected ✅" });
  } catch (err) {
    res.status(500).json({ message: "Supabase connection failed ❌", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("FocusFlow Backend Running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
