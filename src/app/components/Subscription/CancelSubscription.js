"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { CancelSubscription } from '@/app/actions/subscriptionActions';
import { useDispatch } from 'react-redux';
import { addData, removeData } from '@/app/store/UserDataSlice';
import { fetchUserDetails } from '@/app/actions/userActions';

export function CancelSubscriptionComponent({ subscriptionId, userId }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const dispatch = useDispatch();

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            const result = await CancelSubscription(subscriptionId);

            if (result.success) {
                const updatedUserData = await fetchUserDetails(userId);

                if (updatedUserData) {
                    dispatch(removeData());
                    dispatch(addData(updatedUserData));

                    toast({
                        title: "Success",
                        description: "Your subscription has been cancelled. You can continue using premium features until the end of your billing period."
                    });

                    setOpen(false);
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-red-500 hover:text-red-600">
                    Cancel Subscription
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel your subscription? You'll continue to have access to premium features until the end of your current billing period.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Keep Subscription
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                Cancelling...
                            </>
                        ) : (
                            'Yes, Cancel'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}