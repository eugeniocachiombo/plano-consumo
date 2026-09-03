import { Router, Request, Response } from "express";
import { consumptionPlanRepository } from "../repository/consumption-plan.repository";
import { errorReport } from "../repository/base/errorHandler.repository";

const consumptionPlanRoutes = Router();

consumptionPlanRoutes.post("/consumption-plans", async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        const newPlan = await consumptionPlanRepository.create({ ...req.body, userId });
        return res.status(201).json(newPlan);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionPlanRoutes.get("/consumption-plans", async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        const plans = await consumptionPlanRepository.listByUserId(userId);
        return res.status(200).json(plans);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionPlanRoutes.get("/consumption-plans/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number(req.query.userId);
        const plan = await consumptionPlanRepository.findAndVerifyUser(id, userId);
        return res.status(200).json(plan);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionPlanRoutes.put("/consumption-plans/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number(req.query.userId);
        await consumptionPlanRepository.findAndVerifyUser(id, userId);

        const updatedPlan = await consumptionPlanRepository.update(id, req.body);
        return res.status(200).json(updatedPlan);
    } catch (error) {
        return errorReport(res, error);
    }
});

consumptionPlanRoutes.delete("/consumption-plans/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number(req.query.userId);
        await consumptionPlanRepository.findAndVerifyUser(id, userId);

        await consumptionPlanRepository.delete(id);
        return res.status(200).json({ message: "Registo apagado com sucesso" });
    } catch (error) {
        return errorReport(res, error);
    }
});

export { consumptionPlanRoutes };