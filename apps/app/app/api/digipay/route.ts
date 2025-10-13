import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const providerId = (formData.get("providerId") as string) || "";
    const trackingCode = (formData.get("trackingCode") as string) || "";
    const status =
      (formData.get("result") as "SUCCESS" | "FAILURE" | null) ?? null;

    const envBase = process.env.NEXT_PUBLIC_BASE_URL;
    const host =
      req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const fallbackBase = host ? `https://${host}` : undefined;

    const base = envBase ?? fallbackBase ?? "https://igraphical.ir";

    const redirectUrl = new URL("/checkout-result", base);
    redirectUrl.searchParams.set("providerId", providerId);
    redirectUrl.searchParams.set("trackingCode", trackingCode);
    redirectUrl.searchParams.set("Status", status === "SUCCESS" ? "OK" : "NOK");
    redirectUrl.searchParams.set("paymentMethod", "DIGIPAY");

    return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
  } catch (error) {
    console.error("Error parsing form data:", error);
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
}
