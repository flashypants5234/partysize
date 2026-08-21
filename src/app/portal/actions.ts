"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

export async function logOutCaseSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CASE_SESSION_COOKIE);
  redirect("/");
}
