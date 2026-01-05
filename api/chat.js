export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` // Kunci diambil dari setting Vercel
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Kamu adalah asisten AI yang membantu orang untuk coding di luar batas chatgpt untuk deepcoding, dan menggunakan bahasa gaul." },
          { role: "user", content: message }
        ],
        stream: false
      })
    });

    const data = await response.json();
    
    // Kirim jawaban balik ke frontend
    return res.status(200).json({ 
      reply: data.choices[0].message.content 
    });

  } catch (error) {
    return res.status(500).json({ error: 'Gagal menghubungi DeepSeek' });
  }
}
