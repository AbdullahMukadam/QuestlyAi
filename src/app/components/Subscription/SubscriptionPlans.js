"use client"
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createSubscription, verifySubscription } from '@/app/actions/subscriptionActions';
import { fetchUserDetails } from '@/app/actions/userActions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/nextjs';
import { addData, removeData } from '@/app/store/UserDataSlice';

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
    const dispatch = useDispatch()

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        if (userId) {
            const data = await fetchUserDetails(userId);
            if (data) {
                setUserInfo(data);
            }
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubscription = async (planId, amount, planname) => {
        setSelectedPlan(planId);
        try {
            const result = await createSubscription(planId, planname);
            if (!result.success) {
                throw new Error(result.error);
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: result.subscription.id,
                name: "QuestlyAi",
                description: "Monthly Subscription",
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

                            const updatedUserData = await fetchUserDetails(userId);

                            if (updatedUserData) {
                                setUserInfo(updatedUserData);

                                dispatch(removeData());
                                dispatch(addData(updatedUserData));

                                toast({
                                    title: "Success",
                                    description: "Subscription activated successfully!",
                                });
                            }
                        } else {
                            throw new Error(verificationResult.error || "Verification failed");
                        }
                    } catch (error) {
                        toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive"
                        });
                    }
                    setSelectedPlan(null);
                },
                modal: {
                    ondismiss: function () {
                        setSelectedPlan(null);
                        toast({
                            title: "Info",
                            description: "Payment cancelled",
                        });
                    }
                },
                prefill: {
                    name: "User's Name",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#10B981"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            setSelectedPlan(null);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-t-emerald-300 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
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