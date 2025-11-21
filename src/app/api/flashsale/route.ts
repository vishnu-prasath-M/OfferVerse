import { NextResponse } from "next/server";

// GitHub Actions will call: https://YOUR-VERCEL-DOMAIN.vercel.app/api/flashsale

export async function GET() {
  console.log("Flash sale dummy update triggered");
  return NextResponse.json({
    success: true,
    message: "Flash sale dummy update triggered successfully",
  });
}

