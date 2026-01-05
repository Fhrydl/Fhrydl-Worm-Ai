export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { history } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY; // Pastikan ini ada di Vercel env

  if (!apiKey) return res.status(500).json({ error: "API Key Kosong" });

  // System Prompt
  const systemPrompt = {
    role: "system",
    content: "Kamu adalah Fhrydl Worm Ai, asisten coding yang jago dan gaul. Kamu bisa melihat dan menganalisa gambar/codingan yang dikirim user. Jawab langsung ke intinya dengan gaya santai."
  };

  const finalMessages = [systemPrompt, ...history];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // UPDATE BARU: Menggunakan model Llama 4 Scout (Pengganti resmi vision)
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: finalMessages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    const data = await response.json();
    
    // Error Handling jika Groq menolak request
    if (!response.ok) {
        return res.status(500).json({ error: `Groq Error: ${JSON.stringify(data)}` });
    }
    
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
