import { NextResponse } from "next/server";

const NEDS_API_URL = "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10";

export async function GET() {
  try {
    const response = await fetch(NEDS_API_URL);
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return NextResponse.json(error);
  }
}
