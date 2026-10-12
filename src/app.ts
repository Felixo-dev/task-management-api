import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js"
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running",
  });
});

app.use("/api/health", healthRoutes );
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//error handler
app.use(errorHandler);

export default app;