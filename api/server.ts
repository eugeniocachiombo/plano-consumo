import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/user.routes.js";
import { categoryRoutes } from "./routes/category.routes.js";
import { consumptionPlanRoutes } from "./routes/consumption-plan.routes.js";
import { consumptionRoutes } from "./routes/consumption.routes.js";

const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", consumptionPlanRoutes);
app.use("/api", consumptionRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API rodando!",
    environment: process.env.NODE_ENV,
  });
});


if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Servidor a rodar na porta 3000");
  });
}

export default app;