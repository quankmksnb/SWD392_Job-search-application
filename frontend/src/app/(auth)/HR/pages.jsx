'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Hook để lấy thông tin user và roles
export const useRoles = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const getUserFromStorage = () => {
            try {
                const stored = localStorage.getItem('user');
                if (stored) {
                    const data = JSON.parse(stored);
                    return data.user || data;
                }
            } catch (error) {
                console.error('Error parsing user from storage:', error);
            }
            return null;
        };

        const userData = getUserFromStorage();
        setUser(userData);
    }, []);

    return {
        isHR: user?.role_id === 2,
        isAdmin: user?.role_id === 1,
        isCandidate: user?.role_id === 3,
        userRole: user?.role,
        userRoleId: user?.role_id,
        user: user
    };
};

// Hàm check permission
export const hasPermission = (user, requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role) || requiredRoles.includes(Number(user.role_id));
};

// HOC cho Job Posting permission
export const withJobPostingPermission = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const { isHR, isAdmin, userRole } = useRoles();

        useEffect(() => {
            // Chỉ HR và Admin được truy cập
            if (!isHR && !isAdmin) {
                router.push('/unauthorized');
            }
        }, [isHR, isAdmin, router]);

        if (!isHR && !isAdmin) {
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-4">
                            Access Denied
                        </div>
                        <p className="text-gray-600 mb-4">
                            Your role: <strong>{userRole}</strong> doesn't have permission to access Job Posting.
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                            Only HR and Admin can access this section.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

// Hook check auth trực tiếp (optional)
export const useAuth = () => {
    const router = useRouter();
    const { user, isHR, isAdmin, isCandidate } = useRoles();

    const checkAuth = (requiredRoles = []) => {
        if (!user) {
            router.push('/login');
            return false;
        }

        if (requiredRoles.length > 0 && !requiredRoles.includes(user.role_id)) {
            router.push('/unauthorized');
            return false;
        }

        return true;
    };

    return {
        user,
        isHR,
        isAdmin,
        isCandidate,
        checkAuth
    };
};