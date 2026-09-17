import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, company, targetMarket, budgetTier, servicesNeeded, message } = body;

    // Server-side validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid corporate email address is required." },
        { status: 400 }
      );
    }

    // In a production setup, here we integrate with CRM / Webhook / Resend / SendGrid
    console.log("[Lead Inbound Submission]:", {
      fullName,
      email,
      company,
      targetMarket,
      budgetTier,
      servicesNeeded,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your growth consultation request has been received. An executive partner will reach out within 48 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process briefing request. Please try again or contact direct." },
      { status: 500 }
    );
  }
}
