/*
  Warnings:

  - A unique constraint covering the columns `[authToken]` on the table `utilizadores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "utilizadores" ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Vendedor';

-- AlterTable
ALTER TABLE "vendas" ADD COLUMN     "clienteId" INTEGER;

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "criadorEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_authToken_key" ON "utilizadores"("authToken");

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
