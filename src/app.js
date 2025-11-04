import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import linkRoutes from "./routes/link.routes.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to my api ");
});
app.use("/api/v1/links", linkRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
