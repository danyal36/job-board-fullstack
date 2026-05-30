import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuthStore } from '../store/auth.store';

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['JOB_SEEKER', 'EMPLOYER']),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof schema>;

const inputClass =
  'mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/jobs', { replace: true });
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'JOB_SEEKER' },
  });

  const onSubmit = async ({ confirmPassword: _confirmPassword, ...values }: FormValues) => {
    try {
      await registerUser(values);
      navigate('/jobs', { replace: true });
    } catch (err) {
      const msg =
        (err as AxiosError<{ message: string }>).response?.data?.message ??
        'Registration failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-900">
              First name
            </label>
            <input id="firstName" type="text" {...register('firstName')} className={inputClass} />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-900">
              Last name
            </label>
            <input id="lastName" type="text" {...register('lastName')} className={inputClass} />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-900">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-900">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            className={inputClass}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-900">
            I am a…
          </label>
          <select id="role" {...register('role')} className={inputClass}>
            <option value="JOB_SEEKER">Job seeker</option>
            <option value="EMPLOYER">Employer</option>
          </select>
        </div>

        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
