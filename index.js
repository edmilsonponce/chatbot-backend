import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Rota do chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensagem não enviada." });
    }

    // 🔑 sua chave virá das variáveis de ambiente do Render
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API KEY não configurada." });
    }

    // chamada para OpenAI → GPT-4.1 mini (ou outro modelo)
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um assistente útil e amigável." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await resposta.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "Erro ao gerar resposta."
    });
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
