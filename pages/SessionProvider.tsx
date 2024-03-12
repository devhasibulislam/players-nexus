// pages/SessionProvider.tsx
import React from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
  session: any; // Define the type for your session object accordingly
}

const SessionProvider: React.FC<Props> = ({ children, session }) => {
  return (
    <NextAuthProvider session={session}>
      {children}
    </NextAuthProvider>
  );
};

export default SessionProvider;
