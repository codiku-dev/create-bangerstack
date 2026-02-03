'use client';

import { useMemo } from 'react';
import { SigninForm } from './signin-form';
import { SignupForm } from './signup-form';
import { AccountForm } from './account-form';

const DEMO_PASSWORD = 'password123';

function useDemoCredentials() {
  return useMemo(
    () => ({
      email: `demo-${crypto.randomUUID().slice(0, 8)}@example.com`,
      password: DEMO_PASSWORD,
    }),
    []
  );
}

export function AuthStep() {
  const { email: demoEmail, password: demoPassword } = useDemoCredentials();

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Demo: sign up, sign in, then see your account. All use the Better Auth client (signIn.email, signUp.email, signOut, useSession).
      </p>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Sign up</h3>
          <SignupForm defaultEmail={demoEmail} defaultPassword={demoPassword} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Sign in</h3>
          <SigninForm defaultEmail={demoEmail} defaultPassword={demoPassword} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Account</h3>
          <AccountForm />
        </div>
      </div>
    </div>
  );
}
