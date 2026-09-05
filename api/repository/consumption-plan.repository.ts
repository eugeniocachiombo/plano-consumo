import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

class ConsumptionPlanRepository extends Crud {
    constructor() {
        super("ConsumptionPlan", {
            create: createConsumptionPlanSchema,
            update: updateConsumptionPlanSchema
        });
    }

    async listByUserId(userId: number) {
        const list = await this.list();
        return list.filter((plan: any) => plan.userId === userId);
    }

    async findAndVerifyUser(id: number | string, userId: number) {
        const item = await this.find(id);
        if (!item || item.userId !== userId) {
            throw new Error("Plano de consumo não encontrado ou acesso não autorizado.");
        }
        return item;
    }
}


function requiredNumber(requiredMsg: string, invalidMsg: string) {
    return z.number({
        error: (issue) => {
            if (issue.input === undefined) return requiredMsg;
            return invalidMsg;
        },
    });
}

export const createConsumptionPlanSchema = z.object({
    amount: requiredNumber(
        "O montante planeado é obrigatório",
        "O montante deve ser um valor numérico"
    )
        .positive("O montante planeado deve ser superior a zero")
        .max(99999999.99, "O montante não pode ultrapassar 99.999.999,99"),

    month: requiredNumber(
        "O mês é obrigatório",
        "Selecione um mês válido"
    )
        .int("O mês deve ser um número inteiro")
        .min(1, "O mês deve estar entre 1 e 12")
        .max(12, "O mês deve estar entre 1 e 12"),

    year: requiredNumber(
        "O ano é obrigatório",
        "Informe um ano válido"
    )
        .int("O ano deve ser um número inteiro")
        .min(2000, "O ano deve ser igual ou superior a 2000")
        .max(2100, "O ano deve ser inferior a 2100"),

    userId: requiredNumber(
        "O utilizador é obrigatório",
        "Selecione um utilizador válido"
    )
        .int("Identificador de utilizador inválido")
        .positive("Selecione um utilizador válido"),

    categoryId: requiredNumber(
        "A categoria é obrigatória",
        "Selecione uma categoria válida"
    )
        .int("Identificador de categoria inválido")
        .positive("Selecione uma categoria válida"),
});

export const updateConsumptionPlanSchema = createConsumptionPlanSchema.partial();

export type CreateConsumptionPlanInput = z.infer<typeof createConsumptionPlanSchema>;
export type UpdateConsumptionPlanInput = z.infer<typeof updateConsumptionPlanSchema>;

export const consumptionPlanRepository = new ConsumptionPlanRepository();