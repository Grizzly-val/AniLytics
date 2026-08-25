import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const season = searchParams.get("season");
  const seasonYear = searchParams.get("seasonYear");

  if (!season || !seasonYear) {
    return NextResponse.json(
      {
        error:
          "Missing required query parameters: season and seasonYear are required.",
      },
      { status: 400 }
    );
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

  try {
    const query = new URLSearchParams({
      season,
      seasonYear,
    });

    const response = await fetch(
      `${backendUrl}/seasonal?${query.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream service error (HTTP ${response.status})` },
        { status: response.status >= 400 && response.status < 600 ? response.status : 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}

