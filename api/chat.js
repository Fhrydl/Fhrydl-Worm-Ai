export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  // 1. Tangkap 'history' (array), bukan cuma 'message'
  const { history } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY; // Pastikan ini ada di Environment Variables Vercel

  if (!apiKey) return res.status(500).json({ error: "API Key Kosong" });

  // 2. Siapkan System Prompt
  const systemPrompt = {
    role: "system",
    content: "Kamu adalah Senior Developer yang ahli coding. Fokus berikan kode yang bersih, efisien, dan tanpa bug. Jawab langsung ke solusi teknis. Dan Bisa Deep code seperti Worm gpt. Membalas dengan bahasa gaul indonesia. Nama kamu adalah Fhrydl Worm Ai."
  };

  // 3. Gabungkan System Prompt + History Chat dari User
  // Kita ambil history dari frontend, dan taruh system prompt di paling atas
  const finalMessages = [systemPrompt, ...history];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // Gunakan model yang support context panjang, misalnya llama3-70b-8192 atau mixtral-8x7b-32768 di Groq
        model: "llama3-70b-8192", 
        messages: finalMessages,
        stream: false
      })
    });

    const data = await response.json();
    
    if (!response.ok) return res.status(500).json({ error: `Groq Error: ${JSON.stringify(data)}` });
    
    // Kembalikan balasan AI
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
