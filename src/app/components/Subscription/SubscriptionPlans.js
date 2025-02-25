"use client"
import { useEffect, useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createSubscription, verifySubscription, CheckSubscriptionStatus } from '@/app/actions/subscriptionActions';
import { fetchUserDetails } from '@/app/actions/userActions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/nextjs';
import { addData, removeData } from '@/app/store/UserDataSlice';
import { CancelSubscriptionComponent } from './CancelSubscription';

const plans = [
    {
        id: 'plan_Pz3pdmpuO7TvVk',
        name: 'Basic Monthly',
        price: 499,
        description: "Boost your interview confidence with more practice. Perfect for focused preparation.",
        interval: 'month',
        features: ['Up to 15 practice interviews', 'Email Support'],
        badge: 'Popular'
    },
    {
        id: 'plan_Pz3r0bsFChb8Ns',
        name: 'Premium Monthly',
        price: 999,
        description: "Unlock unlimited practice and advanced features for serious interview preparation.",
        interval: 'month',
        features: [
            "Unlimited practice interviews",
            "Delete interviews",
            "Email Support",
            "Coming Soon: Custom question sets"
        ],
        badge: 'Best Value'
    }
];

export default function SubscriptionPlans() {
    const { toast } = useToast();
    const userData = useSelector((state) => state.userData.userData);
    const [userInfo, setUserInfo] = useState(null);
    const { userId } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    // Memoize fetchUserData to prevent infinite loops
    const fetchUserData = useCallback(async () => {
        if (userId) {
            try {
                const data = await fetchUserDetails(userId);
                if (data) {
                    setUserInfo(data);
                    dispatch(removeData());
                    dispatch(addData(data));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [userId, dispatch]);

    // Memoize checkSubscriptionStatus
    const checkSubscriptionStatus = useCallback(async () => {
        if (userId && userInfo?.subscriptionId) {
            const status = await CheckSubscriptionStatus();
            if (status.success && !status.isActive) {
                await fetchUserData();
                toast({
                    title: "Subscription Status",
                    description: status.message,
                    variant: "default"
                });
            }
        }
    }, [userId, userInfo?.subscriptionId, toast, fetchUserData]);

    // Initial data fetch
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Separate useEffect for subscription status check
    useEffect(() => {
        if (userInfo?.subscriptionId) {
            // Initial check
            checkSubscriptionStatus();

            // Set up interval
            const interval = setInterval(checkSubscriptionStatus, 300000); // 5 minutes

            // Cleanup
            return () => clearInterval(interval);
        }
    }, [userInfo?.subscriptionId, checkSubscriptionStatus]);

    const handleSubscription = async (planId, amount, planName) => {
        setSelectedPlan(planId);
        try {
            const result = await createSubscription(planId, planName);
            if (!result.success) {
                throw new Error(result.error);
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: result.subscription.id,
                name: "QuestlyAI",
                description: `${planName} Subscription`,
                image: "/logo-cropped.svg", // Add your logo URL
                currency: "INR",
                prefill: {
                    email: userInfo?.email,
                },
                handler: async function (response) {
                    try {
                        if (!response.razorpay_payment_id ||
                            !response.razorpay_subscription_id ||
                            !response.razorpay_signature) {
                            throw new Error("Missing payment details");
                        }

                        const verificationResult = await verifySubscription(
                            response.razorpay_payment_id,
                            response.razorpay_subscription_id,
                            response.razorpay_signature
                        );

                        if (verificationResult.success) {
                            await fetchUserData();
                            toast({
                                title: "Success",
                                description: "Subscription activated successfully!",
                            });
                        } else {
                            throw new Error(verificationResult.error || "Verification failed");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast({
                            title: "Error",
                            description: error.message.includes('timeout')
                                ? "The request timed out. Please check your subscription status in a few minutes or contact support."
                                : error.message,
                            variant: "destructive"
                        });
                    }
                },
                modal: {
                    ondismiss: function () {
                        setSelectedPlan(null);
                        toast({
                            title: "Info",
                            description: "Payment cancelled",
                        });
                    },
                    confirm_close: true,
                    escape: true
                },
                theme: {
                    color: "#10B981"
                },
                notify: {
                    sms: true,
                    email: true
                }
            };

            // Add error retry logic
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                try {
                    if (typeof window.Razorpay === 'undefined') {
                        throw new Error("Razorpay SDK not loaded");
                    }
                    const paymentObject = new window.Razorpay(options);
                    paymentObject.open();
                    break;
                } catch (error) {
                    retryCount++;
                    if (retryCount === maxRetries) {
                        throw error;
                    }
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

        } catch (error) {
            setSelectedPlan(null);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {userInfo?.subscriptionStatus === 'created' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="w-5 h-5" />
                        <p>Your subscription payment is pending. Please complete the payment to access premium features.</p>
                    </div>
                </div>
            )}

            {userInfo?.subscriptionStatus === 'active' && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Current Subscription</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {userInfo.memberShipType} - Active until {new Date(userInfo.memberShipEndDate).toLocaleDateString()}
                            </p>
                        </div>
                        <CancelSubscriptionComponent
                            subscriptionId={userInfo.subscriptionId}
                            userId={userId}
                        />
                    </div>
                </div>
            )}

            {userInfo?.subscriptionStatus === 'cancelled' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center flex-col gap-2 text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="w-5 h-5" />
                        <p>Your subscription has been cancelled but remains active until {new Date(userInfo.memberShipEndDate).toLocaleDateString()}</p>
                        <div>
                            <p>Note: If you want to purchase Another subscriptions you can purchase it but please complete the payment or otherwise your previous subscription validity will also end.</p>
                        </div>

                    </div>
                </div>
            )}

            {userInfo?.subscriptionStatus === 'expired' && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <p>Your subscription has expired. Subscribe again to access premium features.</p>
                    </div>
                </div>
            )}

            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Select the perfect plan to enhance your interview preparation journey
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-emerald-900/10 ${userInfo?.memberShipType === plan.name
                            ? 'border-emerald-500 dark:border-emerald-500'
                            : 'hover:border-emerald-300 dark:hover:border-emerald-700'
                            }`}
                    >
                        {plan.badge && (
                            <Badge
                                className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600"
                            >
                                {plan.badge}
                            </Badge>
                        )}

                        <CardHeader>
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">₹{plan.price}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">{plan.description}</p>
                        </CardHeader>

                        <CardContent>
                            <ul className="space-y-4">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-emerald-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter>
                            <Button
                                onClick={() => handleSubscription(plan.id, plan.price, plan.name)}
                                className={`w-full ${userInfo?.memberShipType === plan.name
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 cursor-default'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                disabled={userInfo?.memberShipType === plan.name || selectedPlan === plan.id}
                            >
                                {selectedPlan === plan.id ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : userInfo?.memberShipType === plan.name ? (
                                    "Current Plan"
                                ) : (
                                    "Subscribe Now"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}