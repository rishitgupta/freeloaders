import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ProtectedRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Loading state
  if (status === 'loading') {
    return null
  };


  // Redirect if user doesn't have the required role
  if (session && session?.user.role !== requiredRole) {
    router.push('/');
    return null;
  }

  // If the user is authenticated and has the correct role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
