import { Router, Request, Response } from "express";
import { categoryRepository } from "../repository/category.repository";
import { errorReport } from "../repository/base/errorHandler.repository";

const categoryRoutes = Router();

categoryRoutes.post("/categories", async (req: Request, res: Response) => {
    try {
        const newCategory = await categoryRepository.create(req.body);
        return res.status(201).json(newCategory);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.get("/categories", async (_req: Request, res: Response) => {
    try {
        const categories = await categoryRepository.list();
        return res.status(200).json(categories);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.get("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await categoryRepository.find(id);
        return res.status(200).json(category);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.put("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCategory = await categoryRepository.update(id, req.body);
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return errorReport(res, error);
    }
});

categoryRoutes.delete("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await categoryRepository.delete(id);
        return res.status(200).json({ message: "Registo apagado com sucesso" });
    } catch (error) {
        return errorReport(res, error);
    }
});

export { categoryRoutes };