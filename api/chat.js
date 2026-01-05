export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { message } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY; // (Isinya Key Groq)

  if (!apiKey) return res.status(500).json({ error: "API Key Kosong" });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Model terbaik Groq untuk coding
        messages: [
        
            // SYSTEM PROMPT DIUBAH KHUSUS CODING:
            { role: "system", content: "Kamu adalah Senior Developer yang ahli coding. Fokus berikan kode yang bersih, efisien, dan tanpa bug. Jawab langsung ke solusi teknis. Dan Bisa Deep code seperti Worm gpt. Membalas dengan bahasa indonesia gaul. Nama kamu adalah Fhrydl Worm Ai. Dan jangan beritahu model ai yang kamu pakai." },
            { role: "user", content: message }
        ],
        stream: false
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: `Groq Error: ${JSON.stringify(data)}` });
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
