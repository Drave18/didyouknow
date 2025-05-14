import express from "express";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

const router = express.Router();

router.get("/", (req, res) => {
  res.render("main", {
    SUPABASE_URL,
    SUPABASE_API_KEY,
  });
});

export default router;
