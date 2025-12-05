import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // caso ainda não tenha importado

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "Mensagem não enviada." });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API KEY não configurada." });

    // Prompt personalizado
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:"IMportante: todo o dialogo deve ser em espanhol da Espanha" +
                    "Você é o assistente virtual da Edmilson Ponce Marketing Digital. " +
                     "Responda de forma profissional, clara e objetiva. " +
                     "Forneça dicas de marketing digital, tráfego pago e webdesign para pequenas empresas. " +
                     "Não fale sobre assuntos fora do contexto."
          },
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

