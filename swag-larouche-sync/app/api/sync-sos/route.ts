import { NextResponse } from "next/server";
import { fetchSaleOrders } from "@/lib/odooClient";

export async function POST(request: Request) {
  try {
    const { fromDate, toDate } = await request.json();

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: "fromDate and toDate are required" },
        { status: 400 }
      );
    }

    const data = await fetchSaleOrders(fromDate, toDate);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
