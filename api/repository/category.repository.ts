import { z } from 'zod';
import { Crud } from "./base/crud.repository";

class CategoryRepository extends Crud {
    constructor() {
        super("Category", {
            create: createCategorySchema,
            update: updateCategorySchema
        });
    }

    async listByUserId(userId: number) {
        const list = await this.list();
        return list.filter((category: any) => category.userId === userId);
    }

    async findAndVerifyUser(id: number | string, userId: number) {
        const item = await this.find(id);
        if (!item || item.userId !== userId) {
            throw new Error("Categoria não encontrada ou acesso não autorizado.");
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

export const createCategorySchema = z.object({
    name: z.string({
        error: (issue) => {
            if (issue.input === undefined) return "O nome da categoria é obrigatório";
            return "Informe um nome válido para a categoria";
        }
    })
        .trim()
        .min(1, "O nome da categoria é obrigatório")
        .max(255, "O nome da categoria deve ter no máximo 255 caracteres"),

    userId: requiredNumber(
        "O utilizador é obrigatório",
        "Selecione um utilizador válido"
    )
        .int("Identificador de utilizador inválido")
        .positive("Selecione um utilizador válido"),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryRepository = new CategoryRepository();