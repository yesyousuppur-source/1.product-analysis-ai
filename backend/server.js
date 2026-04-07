import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/analysis", async (req, res) => {
  const { productName, category, platform } = req.body;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: "You are an ecommerce expert",
            },
            {
              role: "user",
              content: `
Analyze this product:

Product: ${productName}
Category: ${category}
Platform: ${platform}

Return:
Demand
Competition
Profit
Risk
Advice
`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    res.json(data.choices[0].message.content);
  } catch (error) {
    res.status(500).json("Error");
  }
});

app.listen(5000, () => {
  console.log("Server running");
});
