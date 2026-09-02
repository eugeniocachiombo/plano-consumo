import express from "express";
import { userRoutes } from "./routes/user.route"; 

const app = express();

app.use(express.json());
app.use("/api", userRoutes);

app.listen(3000, () => {
    console.log("Servidor a rodar na porta 3000");
});