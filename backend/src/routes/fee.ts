import express from "express";
import { getFees } from "../controller/fee";
const router = express.Router();

router.get("/", getFees);

export default router;
