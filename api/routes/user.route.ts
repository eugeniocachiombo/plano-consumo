import { Router, Request, Response } from "express";
import { userRepository } from "../repository/user.repository"; 

const userRoutes = Router();

// 1. Criar Utilizador
userRoutes.post("/users", async (req: Request, res: Response) => {
    try {
        const newUser = await userRepository.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao cadastrar utilizador" });
    }
});

// 2. Listar Todos
userRoutes.get("/users", async (_req: Request, res: Response) => {
    try {
        const users = await userRepository.list();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao listar registos" });
    }
});

// 3. Buscar por ID
userRoutes.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userRepository.find(id);

        if (!user) {
            return res.status(404).json({ message: "Registo não encontrado" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar registo" });
    }
});

// 4. Atualizar Utilizador
userRoutes.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedUser = await userRepository.update(id, req.body);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar registo" });
    }
});

// 5. Apagar Utilizador
userRoutes.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await userRepository.delete(id);
        return res.status(200).json({ message: "Registo apagado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao apagar registo" });
    }
});

export { userRoutes };