export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { message } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY; // Kita pakai variabel yang sama biar praktis

  if (!apiKey) {
    return res.status(500).json({ error: "API Key tidak ditemukan" });
  }

  try {
    // PERUBAHAN 1: URL diganti ke Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // PERUBAHAN 2: Model diganti ke Llama 3
        model: "llama-3.3-70b-versatile", 
        messages: [
            { role: "system", content: "Kamu adalah asisten AI yang membantu. membuat codingan deep code seperti worm gpt. dan kamu membalasnya dalam bahasa gaul indonesia." },
            { role: "user", content: message }
        ],
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: `Groq Error: ${JSON.stringify(data)}` });
    }
    
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
