import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getFees = async (_req: Request, res: Response) => {
  const fees = await prisma.fee.findMany();
  res.json(fees);
};

// export const getFee = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const fee = await prisma.fee.findUnique({ where: { id } });
//   res.json(fee);
// };