import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client with the API key from your environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { headline, about } = body;

    if (!headline || !about) {
      return NextResponse.json({ error: 'Headline and about text are required.' }, { status: 400 });
    }

    console.log('Sending data to Google Gemini API...');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // This is the "prompt" that instructs the AI on its task.
    const prompt = `
      Analyze the following career profile information and generate an optimized version.
      Current Headline: "${headline}"
      Current "About" Section: "${about}"

      Your task is to:
      1.  Create a new, concise, and impactful headline (around 120 characters) optimized for search visibility on professional networks.
      2.  Rewrite the "About" section into a compelling professional summary (around 3-4 paragraphs) in the first person. It should be engaging and highlight key skills and achievements based on the provided text.
      3.  Identify and list the top 5-7 most important technical and soft skills as a simple array of strings.

      Provide your response ONLY in the following valid JSON format. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
      {
        "optimizedHeadline": "Your generated headline here",
        "optimizedSummary": "Your rewritten summary here.",
        "keywords": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

// Find the first '{' and the last '}' to extract the JSON object
const startIndex = text.indexOf('{');
const endIndex = text.lastIndexOf('}');
const jsonString = text.substring(startIndex, endIndex + 1);

// Now parse the extracted JSON string
const parsedResponse = JSON.parse(jsonString);

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    return NextResponse.json({ error: 'An internal server error occurred while communicating with the AI.' }, { status: 500 });
  }
}