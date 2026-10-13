import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { placesConfigured } from "@/lib/studio/places";
import { LoginView } from "../login-view";
import { ScoutClient } from "./scout-client";

export default function ScoutPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-10 opacity-30">
          <div className="h-64 rounded-2xl bg-current" />
        </div>
      }
    >
      <ScoutGate p={params} />
    </Suspense>
  );
}

async function ScoutGate({ p }: { p: Promise<{ gate: string }> }) {
  await connection(); // dynamic boundary
  const { gate } = await p;
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-4">
        <LoginView error="expired" />
      </div>
    );
  }
  return <ScoutClient placesOn={placesConfigured()} />;
}
