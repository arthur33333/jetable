export default async function handler(req, res) {
  // Autoriser votre site Vercel à appeler ce proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetPath = req.query.path;
  if (!targetPath) return res.status(400).json({ error: 'Path manquant' });

  const targetUrl = `https://api.tempmailportal.com${targetPath}`;

  try {
    const headers = {};
    if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur proxy: ' + error.message });
  }
}
