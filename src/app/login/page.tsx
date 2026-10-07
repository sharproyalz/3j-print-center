import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from '~/app/login/_components/login-form';
import { getServerAuthSession } from '~/server/auth';
import { env } from '~/env';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to manage Three J Print Center.',
};

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect('/admin');
  }

  return (
    <main className="container flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-12">
      <LoginForm
        credentialsEnabled={env.NODE_ENV === 'development'}
        googleEnabled={
          Boolean(
            env.GOOGLE_CLIENT_ID &&
              env.GOOGLE_CLIENT_SECRET &&
              env.GOOGLE_CLIENT_ID !== '~' &&
              env.GOOGLE_CLIENT_SECRET !== '~'
          )
        }
      />
    </main>
  );
}
