import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const providerId = formData.get("providerId") as string | null;
    const trackingCode = formData.get("trackingCode") as string | null;
    const status = formData.get("result") as "SUCCESS" | "FAILURE" | null;

    const redirectUrl = new URL("/checkout-result", req.url);
    redirectUrl.searchParams.set("providerId", providerId || "");
    redirectUrl.searchParams.set("trackingCode", trackingCode || "");
    redirectUrl.searchParams.set("Status", status === "SUCCESS" ? "OK" : "NOK");
    redirectUrl.searchParams.set("paymentMethod", "DIGIPAY");

    return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
  } catch (error) {
    console.error("Error parsing form data:", error);
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
}
