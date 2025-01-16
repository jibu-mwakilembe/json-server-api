import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
  const db = router.db;
  const { email, password } = req.body;

  const user = db.get("login").find({ email, password }).value();

  if (user) {
    res.status(200).json({
      token: user.token,
      refresh: user.refresh,
      authUserState: user.authUserState,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

server.use((req, res, next) => {
  if (req.method === "POST" && req.originalUrl !== "/login") {
    return res
      .status(403)
      .json({ message: "Database modification is disabled" });
  }
  next();
});

server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
