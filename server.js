import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory users array
let users = [
  { id: 1, name: "Test User", email: "test@example.com", password: "123456" }
];

// JWT secret key
const SECRET = "supersecretkey";

// -------------------------
// Helper: authenticate token
// -------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// -------------------------
// Routes
// -------------------------

// ✅ Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const newUser = { id: users.length + 1, name: name || "", email, password };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, { expiresIn: "1h" });

  res.json({ success: true, message: "User registered", user: newUser, token });
});

// ✅ Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

  res.json({ success: true, message: "Login successful", user, token });
});

// ✅ Protected Home route
app.get("/home", authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ message: `Welcome to the Home page, ${user?.name || user?.email}!` });
});

// ✅ Optional: Get all users (for testing)
app.get("/users", authenticateToken, (req, res) => {
  res.json(users);
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
