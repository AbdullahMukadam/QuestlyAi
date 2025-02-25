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

async function fetchWithRetry(operation, maxRetries = 3, timeout = 30000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Request timeout'));
                }, timeout);
            });

            const result = await Promise.race([
                operation(),
                timeoutPromise
            ]);

            return result;
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                continue;
            }
        }
    }
    
    throw lastError;
}

export async function createSubscription(planId, planName) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not authenticated");

        await connectToDb();
        const userProfile = await Profile.findOne({ userId });

        const subscription = await fetchWithRetry(async () => {
            return await razorpay.subscriptions.create({
                plan_id: planId,
                customer_notify: 1,
                total_count: 12,
                quantity: 1,
                notes: {
                    userId: userId,
                    planName: planName
                },
                offer_id: null,
                notify_info: {
                    notify_phone: userProfile?.phone,
                    notify_email: userProfile?.email
                }
            });
        });

        // Initial update of user profile
        await Profile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    subscriptionId: subscription.id,
                    subscriptionStatus: 'created', // Set initial status
                    memberShipType: 'free', // Keep as free until payment is verified
                    isPremiumUser: false, // Don't grant premium access yet
                    memberShipStartDate: null,
                    memberShipEndDate: null
                }
            }
        );

        revalidatePath('/Pricing');
        return { success: true, subscription };

    } catch (error) {
        console.error("Subscription creation error:", error);
        if (error.message === 'Request timeout' || error.code === 'UND_ERR_HEADERS_TIMEOUT') {
            return { 
                success: false, 
                error: "The server is taking too long to respond. Please try again." 
            };
        }
        return { success: false, error: error.message };
    }
}

export async function verifySubscription(razorpayPaymentId, razorpaySubscriptionId, razorpaySignature) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not authenticated");

        await connectToDb();

        const subscription = await fetchWithRetry(async () => {
            return await razorpay.subscriptions.fetch(razorpaySubscriptionId);
        });

        // Verify signature
        const body = razorpayPaymentId + "|" + razorpaySubscriptionId;
        const generated_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const isValid = generated_signature === razorpaySignature;

        if (!isValid) {
            throw new Error('Invalid payment signature');
        }

        // Update verification logic to accept 'created' status
        if (isValid) {
            // Accept more Razorpay subscription statuses
            const validStatuses = ['active', 'authenticated', 'created'];
            if (!validStatuses.includes(subscription.status)) {
                throw new Error(`Invalid subscription status: ${subscription.status}`);
            }

            await Profile.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        subscriptionId: razorpaySubscriptionId,
                        subscriptionStatus: 'active', // We set this to active since payment is verified
                        isPremiumUser: true,
                        memberShipStartDate: new Date(),
                        memberShipEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        memberShipType: subscription.plan_id === 'plan_Pz3pdmpuO7TvVk' ? 'Basic Monthly' : 'Premium Monthly'
                    }
                }
            );

            revalidatePath('/Pricing');
            return { success: true };
        }

        throw new Error('Payment verification failed');

    } catch (error) {
        console.error("Subscription verification error:", error);
        if (error.message === 'Request timeout' || error.code === 'UND_ERR_HEADERS_TIMEOUT') {
            return { 
                success: false, 
                error: "Verification is taking longer than expected. Please check your subscription status in a few minutes or contact support." 
            };
        }
        return { success: false, error: error.message };
    }
}

export async function CancelSubscription(subscriptionId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not authenticated");

        await connectToDb();

        // First verify if subscription exists and belongs to user
        const userProfile = await Profile.findOne({ userId, subscriptionId });
        if (!userProfile) {
            throw new Error("Subscription not found or doesn't belong to user");
        }

        // Get subscription details from Razorpay to check current period
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        
        // Calculate the end of current billing period
        const currentPeriodEnd = new Date(subscription.current_end * 1000); // Convert Unix timestamp to Date

        // Cancel subscription with Razorpay
        const result = await razorpay.subscriptions.cancel(subscriptionId, {
            cancel_at_cycle_end: true // This ensures the subscription remains active until period end
        });
        
        if (result) {
            // Update user profile with correct end date
            const user = await Profile.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        subscriptionStatus: 'cancelled',
                        // Use the current period end date from Razorpay
                        memberShipEndDate: currentPeriodEnd,
                        effectiveCancellationDate: currentPeriodEnd
                    }
                },
                { new: true }
            );

            if (!user) {
                throw new Error("Failed to update user profile");
            }

            revalidatePath('/Pricing');
            return {
                success: true,
                message: "Subscription cancelled successfully",
                endDate: currentPeriodEnd
            };
        }
        throw new Error("Failed to cancel subscription with payment provider");

    } catch (error) {
        console.error("Subscription cancellation error:", error);
        return { 
            success: false, 
            error: error.message || "Failed to cancel subscription" 
        };
    }
}

export async function CheckSubscriptionStatus() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not authenticated");

        await connectToDb();
        const user = await Profile.findOne({ userId });
        
        if (!user || !user.subscriptionId) {
            return { success: true, isActive: false, message: "No active subscription" };
        }

        try {
            const subscription = await fetchWithRetry(async () => {
                return await razorpay.subscriptions.fetch(user.subscriptionId);
            });

            const currentPeriodEnd = new Date(subscription.current_end * 1000);
            
            // Update the end date in our database to match Razorpay's period
            if (user.memberShipEndDate.getTime() !== currentPeriodEnd.getTime()) {
                await Profile.findOneAndUpdate(
                    { userId },
                    { $set: { memberShipEndDate: currentPeriodEnd } }
                );
            }

            const now = new Date();
            const endDate = new Date(user.memberShipEndDate);

            // Check if subscription has expired
            if (now > endDate) {
                // Update user profile to expired status
                const updateUser = await Profile.findOneAndUpdate(
                    { userId },
                    {
                        $set: {
                            isPremiumUser: false,
                            memberShipType: 'free',
                            subscriptionId: null,
                            subscriptionStatus: 'expired',
                            // Keep the dates for reference
                            effectiveCancellationDate: null
                        }
                    },
                    { new: true }
                );

                // Verify with Razorpay
                try {
                    const subscription = await razorpay.subscriptions.fetch(user.subscriptionId);
                    
                    // If subscription is still active in Razorpay but expired in our DB,
                    // we should cancel it
                    if (subscription.status === 'active') {
                        await razorpay.subscriptions.cancel(user.subscriptionId);
                    }
                } catch (error) {
                    console.log("Error fetching Razorpay subscription:", error);
                    // Continue with local cancellation even if Razorpay check fails
                }

                // Update user profile
                const userProfile = await Profile.findOneAndUpdate(
                    { userId },
                    {
                        $set: {
                            isPremiumUser: false,
                            memberShipType: 'free',
                            memberShipStartDate: null,
                            memberShipEndDate: null,
                            subscriptionId: null,
                            subscriptionStatus: 'inactive'
                        }
                    },
                    { new: true }
                );

                if (!userProfile) {
                    throw new Error("Failed to update user profile");
                }

                revalidatePath('/Pricing');
                return {
                    success: true,
                    isActive: false,
                    message: "Subscription ended"
                };
            }

            // Return active status with end date
            return {
                success: true,
                isActive: true,
                message: "Subscription is active",
                expiryDate: endDate
            };
        } catch (error) {
            console.error("Error fetching Razorpay subscription:", error);
            // If we can't reach Razorpay, use local data
            return {
                success: true,
                isActive: user.isPremiumUser,
                message: "Using cached subscription status",
                expiryDate: user.memberShipEndDate
            };
        }

    } catch (error) {
        console.error("Subscription status check error:", error);
        return { 
            success: false, 
            error: "Unable to check subscription status. Please try again later." 
        };
    }
}