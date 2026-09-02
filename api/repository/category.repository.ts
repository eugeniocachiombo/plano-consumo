import { z } from 'zod';
import { Crud } from "./base/crud.repository";

export const createCategorySchema = z.object({
    name: z.string().min(1, "O nome da categoria é obrigatório").max(100, "O nome não pode ultrapassar 100 caracteres")
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

class CategoryRepository extends Crud {
    constructor() {
        super("category", {
            create: createCategorySchema,
            update: updateCategorySchema
        });
    }
}

export const categoryRepository = new CategoryRepository();