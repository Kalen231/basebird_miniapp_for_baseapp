import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

export async function POST(req: NextRequest) {
    try {
        const { fid, txHash, skuId } = await req.json();

        if (!fid || !txHash || !skuId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Verify transaction on-chain
        const receipt = await publicClient.getTransactionReceipt({
            hash: txHash as `0x${string}`,
        });

        if (receipt.status !== "success") {
            return NextResponse.json(
                { error: "Transaction failed or not found" },
                { status: 400 }
            );
        }

        // 2. Check recipient
        const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();
        const to = receipt.to?.toLowerCase();

        if (!adminWallet) {
            console.error("NEXT_PUBLIC_ADMIN_WALLET is not set");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        if (to !== adminWallet) {
            return NextResponse.json(
                { error: "Invalid recipient" },
                { status: 400 }
            );
        }

        // 3. Check for duplicate hash
        const { data: existingPurchase, error: fetchError } = await supabase
            .from("purchases")
            .select("id")
            .eq("tx_hash", txHash)
            .maybeSingle();

        if (existingPurchase) {
            return NextResponse.json(
                { error: "Transaction already processed" },
                { status: 400 }
            );
        }

        // 4. Record purchase
        const { error: insertError } = await supabase.from("purchases").insert({
            fid,
            tx_hash: txHash,
            sku_id: skuId,
        });

        if (insertError) {
            console.error("Error inserting purchase:", insertError);
            return NextResponse.json(
                { error: "Failed to record purchase" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error verifying transaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
