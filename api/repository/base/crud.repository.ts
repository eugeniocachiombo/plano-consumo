import { prisma } from "../../lib/prisma";

type PrismaModel = keyof typeof prisma;

export class Crud {
    constructor(protected defaultModel?: PrismaModel) {}
    
    // Auxiliar interno para validar e obter o modelo ativo
    private getModel(model?: PrismaModel): PrismaModel {
        const activeModel = model || this.defaultModel;
        if (!activeModel) {
            throw new Error("Nenhum modelo foi especificado.");
        }
        return activeModel;
    }

    async create(data: object, model?: PrismaModel) {
        try {
            const m = this.getModel(model);
            return await (prisma[m] as any).create({ data });
        } catch (error) {
            return Response.json({ message: 'Erro ao cadastrar' }, { status: 500 });
        }
    }

    async list(model?: PrismaModel) {
        try {
            const m = this.getModel(model);
            return await (prisma[m] as any).findMany();
        } catch (error) {
            return Response.json({ message: 'Erro ao listar registos' }, { status: 500 });
        }
    }

    async find(id: string | number, model?: PrismaModel) {
        try {
            const m = this.getModel(model);
            const item = await (prisma[m] as any).findUnique({
                where: { id }
            });

            if (!item) {
                return Response.json({ message: 'Registo não encontrado' }, { status: 404 });
            }

            return item;
        } catch (error) {
            return Response.json({ message: 'Erro ao buscar registo' }, { status: 500 });
        }
    }

    async update(id: string | number, data: object, model?: PrismaModel) {
        try {
            const m = this.getModel(model);
            return await (prisma[m] as any).update({
                where: { id },
                data
            });
        } catch (error) {
            return Response.json({ message: 'Erro ao atualizar registo' }, { status: 500 });
        }
    }

    async delete(id: string | number, model?: PrismaModel) {
        try {
            const m = this.getModel(model);
            await (prisma[m] as any).delete({ where: { id } });
            return Response.json({ message: 'Registo apagado com sucesso' }, { status: 200 });
        } catch (error) {
            return Response.json({ message: 'Erro ao apagar registo' }, { status: 500 });
        }
    }
}