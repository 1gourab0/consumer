// pages/Account.jsx
import { A } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";

export default function Account() {
    const [activeTab, setActiveTab] = createSignal("profile");
    const [user, setUser] = createSignal({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        joined: "January 2023"
    });

    const [bookings, setBookings] = createSignal([
        {
            id: "BK-12345",
            service: "Deep Cleaning",
            date: "2023-06-15",
            time: "10:00 AM - 2:00 PM",
            status: "Completed",
            provider: "CleanPro Services",
            price: "$120"
        },
        {
            id: "BK-12346",
            service: "Monthly Maintenance",
            date: "2023-07-02",
            time: "9:00 AM - 11:00 AM",
            status: "Upcoming",
            provider: "CleanPro Services",
            price: "$80"
        },
        {
            id: "BK-12347",
            service: "Carpet Cleaning",
            date: "2023-05-20",
            time: "1:00 PM - 3:00 PM",
            status: "Completed",
            provider: "Fresh Carpets Inc.",
            price: "$150"
        }
    ]);

    const [notifications, setNotifications] = createSignal({
        email: true,
        sms: false,
        push: true
    });

    const handleNotificationChange = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-4xl mx-auto p-4 sm:p-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

                <div class="bg-white shadow rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <div class="border-b border-gray-200">
                        <nav class="flex -mb-px">
                            <button
                                onClick={() => setActiveTab("profile")}
                                class={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab() === "profile" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("settings")}
                                class={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab() === "settings" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            >
                                Settings
                            </button>
                        </nav>
                    </div>

                    {/* Profile Tab */}
                    {activeTab() === "profile" && (
                        <div class="p-6 text-purple-800">
                            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                                <img
                                    class="h-24 w-24 rounded-full object-cover"
                                    src={user().avatar}
                                    alt="User avatar"
                                />
                                <div>
                                    <h2 class="text-xl font-bold text-gray-900">{user().name}</h2>
                                    <p class="text-gray-600">Member since {user().joined}</p>
                                    <button class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        Change photo
                                    </button>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Full name</label>
                                    <input
                                        type="text"
                                        value={user().name}
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Email address</label>
                                    <input
                                        type="email"
                                        value={user().email}
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Phone number</label>
                                    <input
                                        type="tel"
                                        value={user().phone}
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>

                            <div class="mt-8 flex justify-end">
                                <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Settings Tab */}
                    {activeTab() === "settings" && (
                        <div class="p-6 ">
                            <h2 class="text-lg font-medium text-purple-700 mb-6">Account Settings</h2>

                            <div class="space-y-8">
                                <div>
                                    <h3 class="text-base font-medium text-gray-900 mb-4">Notifications</h3>
                                    <div class="space-y-4">
                                        <div class="flex items-center">
                                            <input
                                                id="email-notifications"
                                                name="email-notifications"
                                                type="checkbox"
                                                checked={notifications().email}
                                                onChange={() => handleNotificationChange('email')}
                                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label for="email-notifications" class="ml-3 block text-sm font-medium text-gray-700">
                                                Email notifications
                                            </label>
                                        </div>
                                        <div class="flex items-center">
                                            <input
                                                id="sms-notifications"
                                                name="sms-notifications"
                                                type="checkbox"
                                                checked={notifications().sms}
                                                onChange={() => handleNotificationChange('sms')}
                                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label for="sms-notifications" class="ml-3 block text-sm font-medium text-gray-700">
                                                SMS notifications
                                            </label>
                                        </div>
                                        <div class="flex items-center">
                                            <input
                                                id="push-notifications"
                                                name="push-notifications"
                                                type="checkbox"
                                                checked={notifications().push}
                                                onChange={() => handleNotificationChange('push')}
                                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label for="push-notifications" class="ml-3 block text-sm font-medium text-gray-700">
                                                Push notifications
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-base font-medium text-purple-800 mb-4">Change Password</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <label for="current-password" class="block text-sm font-medium text-gray-800">Current password</label>
                                            <input
                                                type="password"
                                                id="current-password"
                                                name="current-password"
                                                class="text-purple-800 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            />
                                        </div>
                                        <div>
                                            <label for="new-password" class="block text-sm font-medium text-gray-800">New password</label>
                                            <input
                                                type="password"
                                                id="new-password"
                                                name="new-password"
                                                class="text-purple-800 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            />
                                        </div>
                                        <div>
                                            <label for="confirm-password" class="block text-sm font-medium text-gray-800">Confirm new password</label>
                                            <input
                                                type="password"
                                                id="confirm-password"
                                                name="confirm-password"
                                                class="text-purple-800 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            />
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                            Update password
                                        </button>
                                    </div>
                                </div>

                                <div class="border-t border-gray-200 pt-6">
                                    <h3 class="text-base font-medium text-red-700 mb-4">Danger Zone</h3>
                                    <div>
                                        <button class="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50">
                                            Delete my account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}