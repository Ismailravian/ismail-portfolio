import { NextResponse } from "next/server";
import { getProfile, getProjects } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  return NextResponse.json(
    { profile, projects },
    {
      headers: {
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
