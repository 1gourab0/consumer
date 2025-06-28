import Razorpay from 'razorpay';
import { createSignal, onMount } from 'solid-js';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Mock service data - in a real app, you'd fetch this using the sellerId
const mockServiceData = {
    "ss_YOGA001": {
        name: "Pre-Wedding Yoga Package",
        description: "Full day yoga session for pre-wedding relaxation and beauty",
        location: "Mumbai, India",
        duration: "8 hours",
        sellerName: "Yoga Wellness Center"
    }
};

export default function OrderSummary() {
    const [booking, setBooking] = createSignal({
        _id: "68585c9cdd2144794c714311", // Simplified from $oid
        bookingId: "bk_Iag-P8FULP",
        consumerId: "user_123",
        consumerEmail: "user@example.com",
        cartId: null,
        bookingDate: new Date(1749600000000),
        groupName: "Pre-Wedding Full",
        items: [
            {
                cartItemId: null,
                menuId: "menu_tijgfQv_uT",
                sellerId: "ss_YOGA001",
                price: 12000,
                currency: "INR",
                preferredDateRange: {
                    from: new Date(1749600000000),
                    to: new Date(1749600000000)
                },
                preferredTime: {
                    start: "09:00",
                    end: "17:00"
                },
                note: "both side",
                addedAt: new Date(1750621340505)
            }
        ],
        status: "requested",
        confirmationBy: null,
        amount: 12000,
        currency: "INR",
        payment: {
            status: "not_initiated",
            paymentIntentId: null,
            method: null,
            paidAt: null
        },
        createdAt: new Date(1750621340545),
        updatedAt: new Date(1750621340545),
        serviceId: "ss_risn7QDOBq"
    });


    const [service, setService] = createSignal(null);

    onMount(() => {
        // In a real app, you would fetch the service data based on sellerId
        const sellerId = booking().items[0].sellerId;
        setService(mockServiceData[sellerId]);
    });

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp.$numberLong));
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalAmount = (amount) => {
        return amount + (0.01 * amount)
    }

    const initiatePayment = async () => {

        const url = import.meta.env.VITE_MS_4; // Use the correct environment variable for payments

        if (!booking()) return;

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const payload = {
            userId: "user_123", // Replace with dynamic user ID if needed
            amount: booking().amount,
            currency: booking().currency,
            bookingId: booking().bookingId
        };

        try {
            // 1. Create Razorpay order via backend
            const res = await fetch(`http://localhost:4444/payment/create_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const order = await res.json(); // Get order data from server

            // 2. Configure Razorpay Checkout options
            const options = {
                key: 'rzp_test_lM68JOZ9naHdSP', // Replace with your Razorpay Key ID
                amount: order.amount,
                currency: order.currency,
                name: 'Test Company',
                description: 'Booking Payment',
                order_id: order.id, // Razorpay order ID from backend
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`http://localhost:4444/payment/verify_payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        console.log('Verification response:', verifyData);
                        // if (verifyData.acknowledged) {
                        //     alert('Payment successful!');
                        //     // window.location.href = '/payment-success'; // Change to your success route
                        // } else {
                        //     alert('Payment verification failed');
                        // }
                    } catch (err) {
                        console.error('Verification error:', err);
                        alert('An error occurred during verification.');
                    }
                },
                prefill: {
                    name: 'Test Username', // You can dynamically set this
                    email: 'user@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#F37254'
                }
            };

            // 4. Open Razorpay Checkout
            const rzp = new window.Razorpay(options); // ✅ Make sure to use window.Razorpay
            rzp.open();

        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Could not initiate payment.');
        }
    };


    return (
        <div class="min-h-screen bg-gray-50 p-4 pb-24">
            <header class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Order Summary</h1>
                <p class="text-gray-500">Review your booking before payment</p>
            </header>

            <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 class="text-lg font-semibold mb-3 text-gray-800">Service Details</h2>
                {service() && (
                    <div>
                        <h3 class="font-medium text-gray-800">{service().name}</h3>
                        <p class="text-gray-600 text-sm mb-2">{service().description}</p>
                        <div class="flex items-center text-sm text-gray-500 mb-1">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {service().location}
                        </div>
                        <div class="flex items-center text-sm text-gray-500 mb-1">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {service().duration}
                        </div>
                        <div class="flex items-center text-sm text-gray-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Provider: {service().sellerName}
                        </div>
                    </div>
                )}
            </div>

            <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 class="text-lg font-semibold mb-3 text-gray-800">Booking Information</h2>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Booking ID:</span>
                        <span class="font-medium">{booking().bookingId}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Date:</span>
                        <span class="font-medium">{formatDate(booking().items[0].preferredDateRange.from)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Time:</span>
                        <span class="font-medium">
                            {booking().items[0].preferredTime.start} - {booking().items[0].preferredTime.end}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Package:</span>
                        <span class="font-medium">{booking().groupName}</span>
                    </div>
                    {booking().items[0].note && (
                        <div class="flex justify-between">
                            <span class="text-gray-600">Special Note:</span>
                            <span class="font-medium text-right">{booking().items[0].note}</span>
                        </div>
                    )}
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 class="text-lg font-semibold mb-3 text-gray-800">Payment Summary</h2>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Service Fee:</span>
                        <span class="font-medium">₹{booking().amount}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Taxes & Fees:</span>
                        <span class="font-medium">₹ {0.01 * booking().amount} </span>
                    </div>
                    <div class="border-t border-gray-200 my-2"></div>
                    <div class="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span class="text-indigo-600">₹{totalAmount(booking().amount)}</span>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white p-4 shadow-lg rounded-t-lg">
                <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
                    onClick={() => initiatePayment()}
                >
                    Proceed to Payment
                </button>
                <p class="text-xs text-center text-gray-500 mt-2">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}