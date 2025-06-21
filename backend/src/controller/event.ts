import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getEvents = async (_req: Request, res: Response) => {
  const events = await prisma.event.findMany();
  res.json(events);
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, date, type } = req.body;
  const event = await prisma.event.create({
    data: { title, date: new Date(date), type },
  });
  res.json(event);
};
