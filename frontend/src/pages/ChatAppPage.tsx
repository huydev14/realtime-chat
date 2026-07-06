import React from 'react';
import Logout from '@/components/auth/Logout';
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/lib/axios';
import { Button } from '@fluentui/react-components';
import { toast } from '@/utils/toast';

const ChatAppPage = () => {
    const user = useAuthStore((state) => state.user);
    const handleOnClick = async () => {
        try {
            await api.get('/users/test', { withCredentials: true });
            toast.success('OK');
        } catch (error) {
            toast.error('Error: ' + error.response?.data?.message || 'Request failed. Please try again.');
            console.error('Error making test request:', error.response);
        }
    };

    return (
        <div>
            {user?.username}
            <Logout />
            <Button onClick={handleOnClick}>test</Button>
        </div>
    );
};

export default ChatAppPage;
