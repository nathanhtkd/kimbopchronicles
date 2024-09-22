import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(request: Request) {
  try {
    // Extract data from the request body
    const body = await request.json();
    const { topics, genre, sentiment_preference } = body;

    console.log("Forwarding request to FastAPI with data:", { topics, genre, sentiment_preference });

    const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/py/generate_audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topics,
        genre,
        sentiment_preference,
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI server returned an error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error forwarding request to FastAPI:', error);
    
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
