import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default {
    async createItensVendas(request, response) {
        try {
            const itensParaSalvar = request.body;

            if (!Array.isArray(itensParaSalvar) || itensParaSalvar.length === 0) {
                return response.status(400).json({
                    message: 'O corpo da requisição deve ser um array de itens e não pode estar vazio.'
                });
            }
            
            const resultado = await prisma.itensVendas.createMany({
                data: itensParaSalvar,
                skipDuplicates: true,
            });

            return response.status(201).json({ 
                message: 'Venda registrada com sucesso!',
                count: resultado.count 
            });

        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async listItensVendas(request, response) {
        try {
            const itensVendas = await prisma.itensVendas.findMany();
            return response.json(itensVendas);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async findItensVendas(request, response) {
        try {
            const { codigo } = request.params;

            const itemVenda = await prisma.itensVendas.findUnique({
                where: { codigo: Number(codigo) }
            });

            if (!itemVenda) {
                return response.status(404).json({ message: 'Item de venda não encontrado.' });
            }
            return response.json(itemVenda);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async updateItensVendas(request, response) {
        try {
            const { codigo } = request.params;
            const {
                codVenda,
                codProduto,
                nomeProduto,
                custoProduto,
                quantidade,
                custoUnitariodeVenda,
                desconto,
                valorTotaldeVenda
            } = request.body;

            const itemVendaExistente = await prisma.itensVendas.findUnique({
                where: { codigo: Number(codigo) }
            });

            if (!itemVendaExistente) {
                return response.status(404).json({ message: 'Item de venda não encontrado para atualização.' });
            }

            const itemVendaAtualizado = await prisma.itensVendas.update({
                where: { codigo: Number(codigo) },
                data: {
                    codVenda: codVenda !== undefined ? Number(codVenda) : itemVendaExistente.codVenda,
                    codProduto: codProduto !== undefined ? Number(codProduto) : itemVendaExistente.codProduto,
                    nomeProduto: nomeProduto !== undefined ? nomeProduto : itemVendaExistente.nomeProduto,
                    custoProduto: custoProduto !== undefined ? parseFloat(custoProduto) : itemVendaExistente.custoProduto,
                    quantidade: quantidade !== undefined ? parseFloat(quantidade) : itemVendaExistente.quantidade,
                    custoUnitariodeVenda: custoUnitariodeVenda !== undefined ? parseFloat(custoUnitariodeVenda) : itemVendaExistente.custoUnitariodeVenda,
                    desconto: desconto !== undefined ? parseFloat(desconto) : itemVendaExistente.desconto,
                    valorTotaldeVenda: valorTotaldeVenda !== undefined ? parseFloat(valorTotaldeVenda) : itemVendaExistente.valorTotaldeVenda
                }
            });
            return response.json(itemVendaAtualizado);
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },

    async deleteItensVendas(request, response) {
        try {
            const { codigo } = request.params;

            const itemVendaExistente = await prisma.itensVendas.findUnique({
                where: { codigo: Number(codigo) }
            });

            if (!itemVendaExistente) {
                return response.status(404).json({ message: 'Item de venda não encontrado para exclusão.' });
            }

            await prisma.itensVendas.delete({
                where: { codigo: Number(codigo) }
            });
            return response.status(204).send();
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    }
};