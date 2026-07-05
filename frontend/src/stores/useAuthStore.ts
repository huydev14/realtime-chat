import { create } from 'zustand';
import { toast } from '../utils/toast';
import { authService } from '../services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });

            await authService.signUp(username, password, email, firstName, lastName);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        } catch (error) {
            console.error('Error signing up:', error);
            toast.error('Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            set({ loading: false });
        }
    },
}));
