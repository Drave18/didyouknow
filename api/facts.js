export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Fetch facts from Supabase
  const response = await fetch(`${SUPABASE_URL}`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
  });
  const data = await response.json();
  return res.status(200).json(data);
}
