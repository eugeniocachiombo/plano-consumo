import express from "express";
import { userRoutes } from "./routes/user.route"; 
import { categoryRoutes } from "./routes/category.routes"; 
import { consumptionPlanRoutes } from "./routes/consumption-plan.routes";
import { consumptionRoutes } from "./routes/consumption.routes";
import cors from "cors";
const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'API rodando...!' });
});
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", consumptionPlanRoutes);
app.use("/api", consumptionRoutes);


app.listen(3000, () => {
    console.log("Servidor a rodar na porta 3000");
});