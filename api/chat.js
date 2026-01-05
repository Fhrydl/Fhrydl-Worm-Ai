export default async function handler(req, res) {
  // Cek method, harus POST
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { history } = req.body;
  // Pastikan variabel ini sesuai dengan nama di Settings Vercel lo
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) return res.status(500).json({ error: "API Key Gemini Kosong di Environment Variables" });

  // 1. Definisikan System Instruction
  const systemInstructionText = "Kamu adalah Senior Developer yang ahli coding. Fokus berikan kode yang bersih, efisien, dan tanpa bug. Jawab langsung ke solusi teknis. Dan Bisa Deep code seperti Worm gpt. Membalas dengan bahasa gaul indonesia. Nama kamu adalah Fhrydl Worm Ai.";

  // 2. Format History User dari style OpenAI ke style Gemini
  const formattedHistory = history.map(msg => {
    return {
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    };
  });

  try {
    // 3. Tembak ke Endpoint REST API Gemini 1.5 Pro (Model paling powerful saat ini)
    // Perubahan ada di URL: 'gemini-1.5-pro'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstructionText }]
        },
        contents: formattedHistory,
        generationConfig: {
          temperature: 0.7, // Sedikit kreatif tapi tetap fokus
          maxOutputTokens: 4096 // Output token lebih besar buat kode panjang
        }
      })
    });

    const data = await response.json();

    // Cek error dari Gemini
    if (!response.ok) {
      return res.status(500).json({ error: `Gemini Error: ${data.error?.message || JSON.stringify(data)}` });
    }

    // 4. Ambil text balasan
    const replyText = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
