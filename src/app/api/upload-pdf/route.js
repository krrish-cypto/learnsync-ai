import { NextResponse } from 'next/server';
const pdfParse = require('pdf-parse');

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    
    // Extract first ~15,000 characters to keep it well within Gemini constraints
    const text = parsed.text.slice(0, 15000);

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
