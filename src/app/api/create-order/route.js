import Razorpay from 'razorpay';
import connectToDb from "@/database/connectToDb";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

export async function POST(req) {
    await connectToDb();
    const { amount, currency } = await req.json();

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            
            receipt: `receipt_order_${Math.random()}`,
            payment_capture: 1, // Auto capture
        };

        const order = await razorpay.orders.create(options);
        return new Response(JSON.stringify(order), { status: 200 });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
    }
} 