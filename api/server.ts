import express from "express";
import { userRoutes } from "./routes/user.route"; 
import { categoryRoutes } from "./routes/category.routes"; 
import cors from "cors";
const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);

app.listen(3000, () => {
    console.log("Servidor a rodar na porta 3000");
});