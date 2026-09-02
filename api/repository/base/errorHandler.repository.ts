import { Response } from "express";
import { ZodError } from "zod";

export function errorReport(res: Response, error: unknown) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Verifique os campos do formulário",
            errors: error.flatten().fieldErrors
        });
    }

    if (error instanceof Error && error.message === "NOT_FOUND") {
        return res.status(404).json({ message: "Registo não encontrado" });
    }

    return res.status(500).json({ message: "Erro interno do servidor", error });
}