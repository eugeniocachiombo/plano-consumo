import { Router, Request, Response } from "express";
import { categoryRepository } from "../repository/category.repository.js";
import { errorReport } from "../repository/base/errorHandler.repository.js";

const categoryRoutes = Router();

categoryRoutes.post("/categories", async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        const newCategory = await categoryRepository.create({ ...req.body, userId });
        return res.status(201).json(newCategory);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.get("/categories", async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        const categories = await categoryRepository.listByUserId(userId);
        return res.status(200).json(categories);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.get("/categories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params);
        const userId = Number(req.query.userId);
        const category = await categoryRepository.findAndVerifyUser(id, userId);
        return res.status(200).json(category);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.put("/categories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params);
        const userId = Number(req.query.userId);
        await categoryRepository.findAndVerifyUser(id, userId);

        const updatedCategory = await categoryRepository.update(id, req.body);
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.delete("/categories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params);
        const userId = Number(req.query.userId);
        await categoryRepository.findAndVerifyUser(id, userId);

        await categoryRepository.delete(id);
        return res.status(200).json({ message: "Registo apagado com sucesso" });
    } catch (error) {
        return errorReport(res, error);
    }
});

export { categoryRoutes };