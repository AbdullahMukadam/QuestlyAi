"use server"
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';
import Profile from "@/Models/Profile";
import connectToDb from "@/database/connectToDb";
import { revalidatePath } from 'next/cache';
import { createHmac } from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createSubscription(planId, planName) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not authenticated");

        await connectToDb();
        const userProfile = await Profile.findOne({ userId });

        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 1, // 12 months of recurring payments
            quantity: 1,
            notes: {
                userId: userId,
                planName: planName
            },
            offer_id: null
        });

        // Initial update of user profile
        await Profile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    subscriptionId: subscription.id,
                    subscriptionStatus: 'created', // Set initial status
                    memberShipType: planName,
                    memberShipStartDate: new Date(),
                    memberShipEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            }
        );

        revalidatePath('/Pricing');
        return { success: true, subscription };

    } catch (error) {
        console.error("Subscription creation error:", error);
        return { success: false, error: error.message };
    }
}

export async function verifySubscription(razorpayPaymentId, razorpaySubscriptionId, razorpaySignature) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not authenticated");

        // Verify signature
        const body = razorpayPaymentId + "|" + razorpaySubscriptionId;
        const generated_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const isValid = generated_signature === razorpaySignature;

        if (!isValid) {
            throw new Error('Invalid payment signature');
        }

        await connectToDb();
        
        // Fetch subscription details
        const subscription = await razorpay.subscriptions.fetch(razorpaySubscriptionId);
        console.log("Subscription Status:", subscription.status); // Debug log
        
        // Accept both 'active' and 'created' status
        if (!['active', 'created', 'authenticated'].includes(subscription.status)) {
            throw new Error(`Invalid subscription status: ${subscription.status}`);
        }

        // Update user profile with subscription details
        await Profile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    subscriptionId: razorpaySubscriptionId,
                    subscriptionStatus: 'active',
                    isPremiumUser: true,
                    memberShipStartDate: new Date(),
                    memberShipEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    memberShipType: subscription.plan_id === 'plan_Pz3pdmpuO7TvVk' ? 'Basic Monthly' : 'Premium Monthly'
                }
            },
            { new: true }
        );

        revalidatePath('/Pricing');
        return { success: true };

    } catch (error) {
        console.error("Subscription verification error:", error);
        return { success: false, error: error.message };
    }
} 