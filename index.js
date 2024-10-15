const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const categoryRoutes = require("./routes/categories.js");
const cors = require("cors");
const expressWs = require("express-ws");
const { fetchTodosForUser } = require("./controllers/todoController");
dotenv.config();
const app = express();
expressWs(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24-hour
    },
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.use("/categories", categoryRoutes);

app.ws("/ws/todos", (ws, req) => {
  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === "fetchTodos") {
        const category = data.category;
        await fetchTodosForUser(ws, req, category);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
