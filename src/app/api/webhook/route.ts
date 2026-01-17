
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Placeholder webhook handler
    return NextResponse.json({ status: 'ok' });
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ status: 'ok', message: 'BaseBird Webhook' });
}
