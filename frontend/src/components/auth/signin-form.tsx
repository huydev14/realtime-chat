import { cn } from '@/lib/utils';
import { PersonRegular, KeyRegular } from '@fluentui/react-icons';
import { Button, Card, Label, Input } from '@fluentui/react-components';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router';
import { toast } from '@/utils/toast';

const signInSchema = z.object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { signIn } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormValues) => {
        const { username, password } = data;
        await signIn(username, password);
        if (useAuthStore.getState().accessToken) {
            navigate('/');
        } 
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card appearance='outline' className='overflow-hidden p-0'>
                <div className='grid p-0 md:grid-cols-2'>
                    <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-6'>
                            {/* header - logo */}
                            <div className='flex flex-col items-center text-center gap-2'>
                                <a href='/' className='mx-auto block w-fit text-center'>
                                    <img src='/logo.svg' alt='logo' />
                                </a>

                                <h1 className='text-2xl font-bold'>Chào mừng quay lại</h1>
                                <p className='text-muted-foreground text-balance'>
                                    Đăng nhập vào tài khoản {import.meta.env.VITE_APP_NAME} của bạn
                                </p>
                            </div>

                            {/* username */}
                            <div className='flex flex-col gap-3'>
                                <Label htmlFor='username' size='medium' required className='block'>
                                    Tên đăng nhập
                                </Label>
                                <Input
                                    type='text'
                                    id='username'
                                    placeholder='username'
                                    className='w-full'
                                    contentBefore={<PersonRegular />}
                                    {...register('username')}
                                />
                                {errors.username && (
                                    <p className='text-destructive text-sm'>{errors.username.message}</p>
                                )}
                            </div>

                            {/* password */}
                            <div className='flex flex-col gap-3'>
                                <Label htmlFor='password' size='medium' required className='block'>
                                    Mật khẩu
                                </Label>
                                <Input
                                    type='password'
                                    id='password'
                                    className='w-full'
                                    contentBefore={<KeyRegular />}
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className='text-destructive text-sm'>{errors.password.message}</p>
                                )}
                            </div>

                            {/* nút đăng nhập */}
                            <Button type='submit' appearance='primary' className='w-full' disabled={isSubmitting}>
                                Đăng nhập
                            </Button>

                            <div className='text-center text-sm'>
                                Chưa có tài khoản?{' '}
                                <Link
                                    to='/signup'
                                    className='text-primary hover:underline hover:text-primary/80 font-medium transition-colors'
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className='bg-muted relative hidden md:block'>
                        <img
                            src='/placeholder.png'
                            alt='Image'
                            className='absolute top-1/2 -translate-y-1/2 object-cover'
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
