export function hasPremiumAccess(userInfo) {
    if (!userInfo) return false;
    
    // Only grant access if subscription is active or cancelled (but not expired)
    if (userInfo.subscriptionStatus === 'active' || 
        (userInfo.subscriptionStatus === 'cancelled' && new Date() < new Date(userInfo.memberShipEndDate))) {
        return true;
    }
    
    return false;
} 