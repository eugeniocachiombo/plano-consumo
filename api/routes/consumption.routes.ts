import { Router, Request, Response } from "express";
import { consumptionRepository } from "../repository/consumption.repository";
import { errorReport } from "../repository/base/errorHandler.repository";

const consumptionRoutes = Router();

consumptionRoutes.post("/consumptions", async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        const newConsumption = await consumptionRepository.create({ ...req.body, userId });
        return res.status(201).json(newConsumption);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionRoutes.get("/consumptions", async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        const consumptions = await consumptionRepository.listByUserId(userId);
        return res.status(200).json(consumptions);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionRoutes.get("/consumptions/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number(req.query.userId);
        const consumption = await consumptionRepository.findAndVerifyUser(id, userId);
        return res.status(200).json(consumption);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionRoutes.put("/consumptions/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number(req.query.userId);
        await consumptionRepository.findAndVerifyUser(id, userId);

        const updatedConsumption = await consumptionRepository.update(id, req.body);
        return res.status(200).json(updatedConsumption);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionRoutes.delete("/consumptions/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number(req.query.userId);
        await consumptionRepository.findAndVerifyUser(id, userId);

        await consumptionRepository.delete(id);
        return res.status(200).json({ message: "Registo apagado com sucesso" });
    } catch (error) {
        return errorReport(res, error);
    }
});

export { consumptionRoutes };