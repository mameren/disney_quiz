import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY is missing.' });
  }

  try {
    // 1. Fetch latest news from TDR official site (or a blog)
    // Using TDR Blog or News release top page
    const targetUrl = 'https://www.tokyodisneyresort.jp/tdr/news.html';
    
    // Fetch the HTML
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    const htmlText = await response.text();

    // 2. Extract meaningful text (simple truncation to avoid token limits if necessary, 
    //    but Gemini 1.5/2.0 can handle huge context, so sending a fair amount is fine)
    //    We'll take the body roughly to save bandwidth/tokens if user is on free tier.
    //    Rough cleanup: remove scripts, styles to reduce noise
    const cleanText = htmlText
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gim, "")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gim, "")
        .replace(/<!--[\s\S]*?-->/g, "");

    // 3. Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // or gemini-1.5-flash

    const prompt = `
    以下のHTMLソースは東京ディズニーリゾートのニュースページです。
    ここから「最新のイベント」や「新しいグッズ」「新しいメニュー」などの情報を読み取り、
    ディズニーファンが楽しめるクイズを3問～5問作成してください。

    条件:
    1. 最新情報に基づいたクイズであること。
    2. JSON形式で出力すること。
    3. JSONの形式は以下の配列フォーマットを厳守すること。
    
    [
      {
        "id": "unique_id_string",
        "genre": "news",
        "difficulty": 3,
        "text": "クイズの質問文",
        "options": ["選択肢1(正解)", "選択肢2", "選択肢3", "選択肢4"],
        "correct": 0,
        "explanation": "解説文。なぜそれが正解なのか、ニュースの背景など。"
      }
    ]

    ※ "correct" は常に 0 (optionsの最初の要素が正解) にしてください。アプリ側でシャッフルします。
    ※ 余計なMarkdown記号（\`\`\`jsonなど）は含めず、純粋なJSONテキストのみを返してください。可能な限り。

    HTMLソース:
    ${cleanText.substring(0, 50000)} // Limit length just in case
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Cleanup response if it contains markdown code blocks
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const quizData = JSON.parse(jsonString);

    return res.status(200).json(quizData);

  } catch (error) {
    console.error("Quiz generation error:", error);
    return res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
}
