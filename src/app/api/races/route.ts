import { NextResponse } from 'next/server';

const NEDS_API_URL = 'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=40';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 250;

async function fetchWithRetry(url: string, retries: number): Promise<Response> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 10 } // Revalidate every 10 seconds
    });

    // If response is 5xx, it's a server error, so we should retry.
    if (response.status >= 500 && retries > 0) {
      // Exponential backoff
      const backoff = INITIAL_BACKOFF_MS * Math.pow(2, MAX_RETRIES - retries);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, retries - 1);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      const backoff = INITIAL_BACKOFF_MS * Math.pow(2, MAX_RETRIES - retries);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function GET() {
  try {
    const url = `${NEDS_API_URL}&_=${new Date().getTime()}`;
    const response = await fetchWithRetry(url, MAX_RETRIES);

    if (!response.ok) {
      return NextResponse.json(
        { message: `API request failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch from Neds API after multiple retries:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred after multiple retries' },
      { status: 500 }
    );
  }
}
