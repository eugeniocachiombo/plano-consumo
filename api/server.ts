import express from "express";
import { userRoutes } from "./routes/user.route"; // ajuste o caminho

const app = express();

app.use(express.json());
app.use(userRoutes);

app.listen(3000, () => {
    console.log("Servidor a rodar na porta 3000");
});