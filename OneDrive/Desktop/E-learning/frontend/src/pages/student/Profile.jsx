import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        bio: '',
        department: '',
        year: '',
        avatar: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                bio: user.bio || '',
                department: user.department || '',
                year: user.year || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updatedUser = await authService.updateProfile(profileData);
            updateUser(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information */}
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
                    <form onSubmit={handleProfileUpdate}>
                        <Input
                            label="Full Name"
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <Input
                            label="Department"
                            type="text"
                            value={profileData.department}
                            onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                            placeholder="e.g., Computer Science"
                        />

                        {user?.role === 'student' && (
                            <Input
                                label="Year"
                                type="number"
                                value={profileData.year}
                                onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                                placeholder="e.g., 3"
                            />
                        )}

                        <Input
                            label="Avatar URL"
                            type="text"
                            value={profileData.avatar}
                            onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                        />

                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </form>
                </Card>

                {/* Change Password */}
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange}>
                        <Input
                            label="Current Password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                        />

                        <Input
                            label="New Password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                        />

                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
