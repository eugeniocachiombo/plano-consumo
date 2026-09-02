import { Router, Request, Response } from "express";
import { userRepository } from "../repository/user.repository";
import { errorReport } from "../repository/base/errorHandler.repository";

const userRoutes = Router();

userRoutes.post("/users", async (req: Request, res: Response) => {
    try {
        const newUser = await userRepository.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        return errorReport(res, error);
    }
});

userRoutes.get("/users", async (_req: Request, res: Response) => {
    try {
        const users = await userRepository.list();
        return res.status(200).json(users);
    } catch (error) {
        return errorReport(res, error);
    }
});

userRoutes.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userRepository.find(id);
        return res.status(200).json(user);
    } catch (error) {
        return errorReport(res, error);
    }
});

userRoutes.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedUser = await userRepository.update(id, req.body);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return errorReport(res, error);
    }
});

userRoutes.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await userRepository.delete(id);
        return res.status(200).json({ message: "Registo apagado com sucesso" });
    } catch (error) {
        return errorReport(res, error);
    }
});

export { userRoutes };