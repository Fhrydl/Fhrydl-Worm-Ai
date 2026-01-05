export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { message } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // Cek apakah API Key terbaca oleh Vercel
  if (!apiKey) {
    return res.status(500).json({ error: "API Key BELUM terbaca di Vercel. Cek Environment Variables." });
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: "Kamu asisten yang membantu." },
            { role: "user", content: message }
        ],
        stream: false
      })
    });

    const data = await response.json();

    // Jika DeepSeek menolak (misal error 401/402), tampilkan pesan aslinya
    if (!response.ok) {
      return res.status(500).json({ error: `DeepSeek Error: ${JSON.stringify(data)}` });
    }
    
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
