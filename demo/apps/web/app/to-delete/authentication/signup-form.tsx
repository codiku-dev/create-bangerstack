'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '@web/libs/auth-client';
import { Badge } from '@repo/ui/badge/badge';
import { Button } from '@repo/ui/button/button';
import { Input } from '@repo/ui/input/input';
import { Label } from '@repo/ui/label/label';
import { cn } from '@web/utils/cn';

const signupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupCodeBlock() {
    return (
        <div className="min-w-0 h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700 shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
                    <div className="flex gap-1 shrink-0">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-400 truncate min-w-0" title="apps/web/app/to-delete/authentication/signup-form.tsx">apps/web/.../signup-form.tsx</span>
                </div>
                <Badge size="sm">Client</Badge>
            </div>
            <div className="p-2 sm:p-4 overflow-auto min-w-0 flex-1 min-h-0">
                <pre className="text-[10px] sm:text-xs font-mono leading-snug text-gray-300 min-w-max">
                    <code>
                        <span className="text-purple-400">await</span> signUp.email({'{\n'}
                        {'  '}name: <span className="text-blue-400">values.name</span>,{'\n'}
                        {'  '}email: <span className="text-blue-400">values.email</span>,{'\n'}
                        {'  '}password: <span className="text-blue-400">values.password</span>,{'\n'}
                        <span className="text-gray-300">{'}'});</span>
                    </code>
                </pre>
            </div>
        </div>
    );
}

export function SignupForm(p: { className?: string; defaultEmail?: string; defaultPassword?: string }) {
    const [result, setResult] = useState<unknown>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: 'Demo User',
            email: p.defaultEmail ?? '',
            password: p.defaultPassword ?? 'password123',
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        setResult(null);
        const res = await signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
        });
        setResult(res ?? null);
    };

    return (
        <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-4 w-full min-w-0 items-stretch', p.className)}>
            <div className="min-w-0 h-full min-h-[200px] lg:min-h-0">
                <SignupCodeBlock />
            </div>
            <div className="min-w-0 h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-800 min-h-[200px] lg:min-h-0">
                <div className="bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-700 shrink-0">
                    <span className="text-xs font-medium text-gray-300">Demo</span>
                </div>
                <div className="p-4 bg-white text-gray-900 flex-1 min-h-0 overflow-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="signup-name" className="text-gray-900">Name</Label>
                            <Input id="signup-name" type="text" placeholder="Your name" {...register('name')} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-email" className="text-gray-900">Email</Label>
                            <Input id="signup-email" type="email" placeholder="you@example.com" {...register('email')} />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-password" className="text-gray-900">Password</Label>
                            <Input id="signup-password" type="text" {...register('password')} />
                            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing up…' : 'Sign up'}
                        </Button>
                    </form>
                </div>
            </div>
            <div className="min-w-0 h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-800 min-h-[200px] lg:min-h-0">
                <div className="bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-700 shrink-0">
                    <span className="text-xs font-medium text-gray-300">Réponse</span>
                </div>
                <div className="p-4 bg-gray-900 flex-1 min-h-0 overflow-auto">
                    <pre className="text-[10px] sm:text-xs font-mono text-gray-300 rounded bg-gray-800 p-3 overflow-x-auto min-h-[80px]">
                        {result != null ? JSON.stringify(result, null, 2) : '—'}
                    </pre>
                </div>
            </div>
        </div>
    );
}
