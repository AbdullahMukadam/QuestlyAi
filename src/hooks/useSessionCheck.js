import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/store/AuthSlice';
import { removeData } from '@/app/store/UserDataSlice';
import { removeQuestions } from '@/app/store/InterviewQuestionSlice';
import { useRouter } from 'next/navigation';

export function useSessionCheck() {
  const { session } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      // Clear Redux state
      dispatch(logout());
      dispatch(removeData());
      dispatch(removeQuestions());
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authStatus');
      }
      
      // Redirect to home
      router.push('/');
    }
  }, [session, dispatch, router]);
} 