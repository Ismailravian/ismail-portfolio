import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getProfile, getProjects } from "@/lib/data/queries";
import { CVDocument } from "@/lib/pdf/CVDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const buffer = await renderToBuffer(
    <CVDocument profile={profile} projects={projects} />
  );
  const filename = `${profile.name.replace(/\s+/g, "_")}_CV.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=300, must-revalidate",
    },
  });
}
