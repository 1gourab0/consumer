// components/Cart.jsx
import { createSignal, createEffect, createMemo } from 'solid-js';
import { A } from '@solidjs/router';

const sampleServices = [
  {
    quantity: 1,
    menuId: "menu_tijgfQv_uT",
    title: "Pre-Wedding Photography",
    description: "Full day pre-wedding shoot with 100 edited photos",
    price: 12000,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1749731894795-4eae105fa60a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    quantity: 1,
    menuId: "menu_makeup001",
    title: "Bridal Makeup",
    description: "Traditional bridal makeup with hairstyling",
    price: 8000,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1684868682581-4cac3af5b8d4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

// Sample cart data structure
const initialCart = {
  cartId: "cart_KyNdiX77Kjex9prcauYMWb0J8jl2as",
  consumerId: "KyNdiX77Kjex9prcauYMWb0J8jl2as",
  createdAt: "2025-06-19T18:56:43.880+00:00",
  updatedAt: "2025-06-19T19:02:57.740+00:00",
  // items: []
  items: sampleServices
};

const availableOffers = [
  {
    id: "offer1",
    code: "WEDDING20",
    description: "Get 20% off on all wedding services",
    discountType: "percentage",
    discountValue: 20,
    minCartValue: 15000,
    validUntil: "2025-12-31"
  },
  {
    id: "offer2",
    code: "FIXED5000",
    description: "Flat ₹5000 off on orders above ₹25000",
    discountType: "fixed",
    discountValue: 5000,
    minCartValue: 25000,
    validUntil: "2025-09-30"
  }
];

// Sample services that could be added to cart


export default function Cart() {
  const [cart, setCart] = createSignal(initialCart);
  const [services, setServices] = createSignal(sampleServices);
  const [isLoading, setIsLoading] = createSignal(false);
  const [couponCode, setCouponCode] = createSignal("");
  const [appliedCoupon, setAppliedCoupon] = createSignal(null);
  const [showOffers, setShowOffers] = createSignal(false);

  // Constants
  const PLATFORM_FEE_PERCENTAGE = 0.10; // Example
  const PLATFORM_FEE_MIN = 8.0;      // Example

  // Subtotal
  const subtotal = createMemo(() => {
    const items = cart()?.items || [];
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  // Discount
  const discountAmount = createMemo(() => {
    const coupon = appliedCoupon();
    if (!coupon) return 0;

    if (coupon.discountType === "percentage") {
      return subtotal() * (coupon.discountValue / 100);
    } else {
      return Math.min(coupon.discountValue, subtotal());
    }
  });

  // Platform Fee (calculated from subtotal only to avoid circular dependency)
  const platformFee = createMemo(() => {
    const fee = subtotal() * (PLATFORM_FEE_PERCENTAGE / 100);
    return Math.max(fee, PLATFORM_FEE_MIN);
  });

  // Total Amount
  const totalAmount = createMemo(() => {
    return subtotal() + platformFee() - discountAmount();
  });


  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  // Add item to cart
  const addToCart = (service) => {
    setIsLoading(true);
    setTimeout(() => {
      setCart(prev => ({
        ...prev,
        items: [...prev.items, {
          cartItemId: `item_${Math.random().toString(36).substr(2, 9)}`,
          menuId: service.menuId,
          title: service.title,
          price: service.price,
          currency: service.currency,
          quantity: 1,
          addedAt: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      }));
      setIsLoading(false);
    }, 500);
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setIsLoading(true);
    setTimeout(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.cartItemId !== cartItemId),
        updatedAt: new Date().toISOString()
      }));
      setIsLoading(false);
    }, 500);
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    setTimeout(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        ),
        updatedAt: new Date().toISOString()
      }));
      setIsLoading(false);
    }, 500);
  };

  // Apply coupon
  const applyCoupon = () => {
    const coupon = availableOffers.find(offer =>
      offer.code.toLowerCase() === couponCode().trim().toLowerCase() &&
      subtotal() >= offer.minCartValue
    );

    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      alert("Invalid coupon code or cart value not met");
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  return (
    <div class="pb-16">
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-6 text-purple-700">Your Cart</h1>

        {/* Cart metadata */}
        <div class="text-sm text-gray-500 mb-4">
          <p>Cart ID: {cart().cartId}</p>
          <p>Last updated: {formatDate(cart().updatedAt)}</p>
        </div>

        {/* Coupon section */}
        <div class="mb-6">
          <div class="flex items-center mb-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              class="flex-1 border rounded-l-lg px-4 py-2"
              value={couponCode()}
              onInput={(e) => setCouponCode(e.currentTarget.value)}
            />
            {appliedCoupon() ? (
              <button
                onClick={removeCoupon}
                class="bg-red-500 text-white px-4 py-2 rounded-r-lg"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={applyCoupon}
                class="bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
              >
                Apply
              </button>
            )}
          </div>
          {appliedCoupon() && (
            <div class="bg-green-50 text-green-700 p-2 rounded text-sm">
              Coupon applied: {appliedCoupon().description}
            </div>
          )}
          <button
            class="text-indigo-600 text-sm mt-2"
            onClick={() => setShowOffers(!showOffers())}
          >
            {showOffers() ? 'Hide offers' : 'View available offers'}
          </button>

          {showOffers() && (
            <div class="mt-3 space-y-2 text-purple-800">
              {availableOffers.map(offer => (
                <div class="border rounded p-3">
                  <div class="font-semibold">{offer.code} - {offer.description}</div>
                  <div class="text-sm text-gray-600">
                    Get {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off
                    {offer.minCartValue > 0 && ` on orders above ₹${offer.minCartValue}`}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Valid until: {formatDate(offer.validUntil)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart items */}
        {cart().items.length === 0 ? (
          <div class="text-center py-10">
            <p class="text-gray-500 mb-4">Your cart is empty</p>
            <A
              href="/services"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg inline-block"
            >
              Browse Services
            </A>
          </div>
        ) : (
          <div class="space-y-4">
            {cart().items.map(item => (
              <div class="bg-white rounded-lg shadow p-4 text-purple-800">
                <div class="flex">
                  <img
                    src={sampleServices.find(s => s.menuId === item.menuId)?.image || ''}
                    alt={item.title}
                    class="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <h3 class="font-semibold">{item.title}</h3>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        class="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                      {sampleServices.find(s => s.menuId === item.menuId)?.description}
                    </p>
                    <div class="flex justify-between items-center mt-3">
                      {/* <div class="flex items-center border rounded">
                        <button
                          class="px-2 py-1"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span class="px-2">{item.quantity}</span>
                        <button
                          class="px-2 py-1"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div> */}
                      <span class="font-bold">
                        {item.currency} {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Order summary */}
            <div class="bg-white rounded-lg shadow p-4 mt-6 text-purple-800">
              <h3 class="font-bold text-lg mb-3">Order Summary</h3>

              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal().toLocaleString()}</span>
                </div>

                <div class="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>₹{platformFee().toLocaleString()}</span>
                </div>

                {appliedCoupon() && (
                  <div class="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon().code}):</span>
                    <span>-₹{discountAmount().toLocaleString()}</span>
                  </div>
                )}

                <div class="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{totalAmount().toLocaleString()}</span>
                </div>
              </div>

              <button
                class="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4 disabled:opacity-50"
                disabled={isLoading()}
              >
                {isLoading() ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}

        {/* Available services (for demo) */}
        {/* {cart().items.length === 0 && (
          <div class="mt-8">
            <h2 class="text-xl font-bold mb-4">Available Services</h2>
            <div class="grid grid-cols-2 gap-4">
              {services().map(service => (
                <div class="bg-white rounded-lg shadow p-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    class="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h3 class="font-semibold text-sm">{service.title}</h3>
                  <p class="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="font-bold text-sm">{service.currency} {service.price.toLocaleString()}</span>
                    <button
                      class="bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                      onClick={() => addToCart(service)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>

    </div>
  );
}