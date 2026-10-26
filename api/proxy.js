
export default async function handler(req, res) {
  // Autoriser les requêtes depuis votre propre site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer la requête de pré-vérification (Preflight) du navigateur
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_BASE = 'https://api.tempmailportal.com';
  // On reconstruit l'URL cible (ex: /api/proxy?path=/api/inbox)
  const targetPath = req.query.path;
  
  if (!targetPath) {
    return res.status(400).json({ error: 'Paramètre "path" manquant' });
  }

  const targetUrl = `${API_BASE}${targetPath}`;

  try {
    // On prépare les en-têtes à transférer (notamment le Token)
    const headers = {};
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    // On fait la requête vers l'API depuis le serveur Vercel
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Erreur interne du proxy' });
  }
}
