'use client';

import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { GoogleIcon } from '~/components/svg/google';
import { Button } from '~/components/ui/button';
import { siteConfig } from '~/config/site';

type Props = {
  credentialsEnabled: boolean;
  googleEnabled: boolean;
};

export function LoginForm({ credentialsEnabled, googleEnabled }: Props) {
  const [email, setEmail] = useState('admin@3jprintcenter.local');
  const [password, setPassword] = useState('admin123');
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleCredentials(event: FormEvent) {
    event.preventDefault();
    setIsCredentialsLoading(true);

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: '/admin',
    });

    setIsCredentialsLoading(false);

    if (result?.error) {
      toast.error('Invalid email or password.');
      return;
    }

    toast.success('Signed in successfully.');
    window.location.href = result?.url || '/admin';
  }

  async function handleGoogle() {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/admin' });
    } catch {
      toast.error('Google sign in failed.');
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Access the {siteConfig.name} admin dashboard.
      </p>

      {credentialsEnabled ? (
        <form className="mt-6 space-y-4" onSubmit={handleCredentials}>
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Local development login. Default: <strong>admin@3jprintcenter.local</strong> /{' '}
            <strong>admin123</strong>
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Email</span>
            <input
              className="w-full rounded-md border px-3 py-2"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Password</span>
            <input
              className="w-full rounded-md border px-3 py-2"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <Button type="submit" className="w-full" disabled={isCredentialsLoading}>
            {isCredentialsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in with email
          </Button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Email/password login is only available in development.
        </p>
      )}

      {googleEnabled ? (
        <>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>
        </>
      ) : null}
    </div>
  );
}
