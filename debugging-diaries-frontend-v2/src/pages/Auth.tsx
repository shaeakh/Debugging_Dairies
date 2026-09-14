import SignInCard from '@/components/auth/signInCard';
import SignUpCard from '@/components/auth/signUpCard';
import { useState } from 'react';

type AuthState = 'signIn' | 'signUp';

const Auth = () => {
  const [authState, setAuthState] = useState<AuthState>('signIn');

  const handleToggle = () => {
    setAuthState((prev) => (prev === 'signIn' ? 'signUp' : 'signIn'));
  };

  return (
    <div className="h-full bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div key={authState} className="w-full max-w-md animate-in">
        {authState === 'signIn' ? (
          <SignInCard onToggle={handleToggle} />
        ) : (
          <SignUpCard onToggle={handleToggle} />
        )}
      </div>
    </div>
  );
};

export default Auth;
