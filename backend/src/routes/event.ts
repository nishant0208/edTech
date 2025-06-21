import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const eventrouter = express.Router();

eventrouter.get("/", async (_req, res): Promise<any> => {
  try {
    const events = await prisma.event.findMany();
    return res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

eventrouter.post("/", async (req, res): Promise<any> => {
  const { title, date, type } = req.body;
  try {
    const event = await prisma.event.create({
      data: { title, date: new Date(date), type },
    });
    return res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});
