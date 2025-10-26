import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateInsights(summary) {
  try {
    // Limit the summary to top 5 columns if it's too big
    const trimmedSummary = Array.isArray(summary)
      ? summary.slice(0, 5)
      : summary;

    const prompt = `
You are a data analyst. Analyze this dataset summary and return 5 concise insights.
Each insight should have:
- "insight": short, clear description (1 line)
- "impact": reason why this matters for decision-making.
Return strictly valid JSON (no markdown, no backticks).
Summary data:
${JSON.stringify(trimmedSummary)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    let text = completion.choices[0]?.message?.content?.trim() || "";

    // Extract JSON if wrapped in markdown or text
    const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    // Try parsing JSON response
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch (err) {
      console.warn("⚠️ AI returned invalid JSON, falling back to raw text.");
      return [{ insight: text, impact: "General AI summary" }];
    }
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    return [
      {
        insight: "AI analysis unavailable.",
        impact: "The system could not connect to OpenAI API.",
      },
    ];
  }
}
