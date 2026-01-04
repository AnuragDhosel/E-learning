import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function Settings() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock update functionality
        alert('Profile update functionality coming soon!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="max-w-2xl">
                <Card className="mb-8">
                    <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            disabled
                            className="bg-gray-100"
                        />

                        <div className="border-t border-gray-200 my-6 pt-6">
                            <h3 className="text-lg font-medium mb-4">Change Password</h3>
                            <Input
                                label="Current Password"
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            />
                            <Input
                                label="New Password"
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                    <p className="text-gray-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="danger" onClick={() => alert('Delete account functionality coming soon!')}>
                        Delete Account
                    </Button>
                </Card>
            </div>
        </div>
    );
}
