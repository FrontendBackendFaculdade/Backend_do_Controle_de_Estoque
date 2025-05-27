import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default {
    async createCondicao(request, response) {
        try {
            const {
                codPagamento,
                quantidadeParcela,
                parcelaInicial,
                intervaloParcelas,
                descricao
            } = request.body;

            const novaCondicao = await prisma.CondicaoPagamento.create({
                data: {
                    codPagamento,
                    quantidadeParcela,
                    parcelaInicial,
                    intervaloParcelas,
                    descricao
                }
            });

            return response.status(201).json(novaCondicao);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async listCondicao(request, response) {
        try {
            const condicao = await prisma.CondicaoPagamento.findMany();
            return response.json(condicao);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async findCondicao(request, response) {
        try {
            const { codigo } = request.params;

            const condicao = await prisma.CondicaoPagamento.findFirst({
                where: { codigo: Number(codigo) }
            });

            if (!condicao) {
                return response.status(404).json({ message: 'Condição de pagamento não encontrada.' });
            }

            return response.json(condicao);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async updateCondicao(request, response) {
        try {
            const { codigo } = request.params;
            const {
                codPagamento,
                quantidadeParcela,
                parcelaInicial,
                intervaloParcelas,
                descricao
            } = request.body;

            const condicaoExistente = await prisma.CondicaoPagamento.findUnique({
                where: { codigo: Number(codigo) }
            });

            if (!condicaoExistente) {
                return response.status(404).json({ message: 'Condição de pagamento não encontrada.' });
            }

            const condicaoAtualizada = await prisma.CondicaoPagamento.update({
                where: { codigo: Number(codigo) },
                data: {
                    codPagamento,
                    quantidadeParcela,
                    parcelaInicial,
                    intervaloParcelas,
                    descricao
                }
            });

            return response.json(condicaoAtualizada);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async deleteCondicao(request, response) {
        try {
            const { codigo } = request.params;

            const condicaoExistente = await prisma.CondicaoPagamento.findUnique({
                where: { codigo: Number(codigo) }
            });

            if (!condicaoExistente) {
                return response.status(404).json({ message: 'Condição de pagamento não encontrada.' });
            }

            await prisma.CondicaoPagamento.delete({
                where: { codigo: Number(codigo) }
            });

            return response.status(201).json({message: "Condição deletada com sucesso"});
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    }
};
