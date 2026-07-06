import { create } from 'zustand';
import { toast } from '../utils/toast';
import { authService } from '../services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
        set({ accessToken });
    },
    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            await authService.signUp(username, password, email, firstName, lastName);
            toast.success('Sign up successful. Please sign in.');
        } catch (error) {
            console.error('Error signing up:', error);
            if (error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Sign up failed. Please try again.');
            }
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });
            const { accessToken } = await authService.signIn(username, password);
            get().setAccessToken(accessToken);
            await get().fetchMe();
            toast.success('Sign in successful');
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error(error.response?.data?.message || 'Sign in failed. Please try again.');
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success('Sign out successful');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error(error.response?.data?.message || 'Sign out failed. Please try again.');
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error('Error fetching user data:', error.response);
            set({ user: null, accessToken: null });
            toast.error(error.response?.data?.message || 'Failed to fetch user data. Please try again.');
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();
            const accessToken = await authService.refresh();
            setAccessToken(accessToken);

            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error('Error refreshing access token:', error.response);
            toast.error('Session expired. Please sign in again.');
            get().clearState();
        } finally {
            set({ loading: false });
        }
    },
}));
