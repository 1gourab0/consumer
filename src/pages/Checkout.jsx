// pages/Checkout.jsx
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

const cartItems = [
  {
    serviceName: "Professional Photography",
    packageName: "Basic Package",
    price: 299,
  },
  {
    serviceName: "Premium Catering",
    packageName: "Standard Package",
    price: 799,
  },
];

export default function Checkout() {
  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process checkout here
    alert("Booking confirmed!");
  };

  return (
    <div class="pb-24">
      <div class="p-4">
        <h1 class="text-xl font-bold mb-6">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div class="mb-6">
            <h2 class="font-medium mb-3">Contact Information</h2>
            <div class="space-y-3">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData().name}
                  onInput={handleInputChange}
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData().email}
                  onInput={handleInputChange}
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData().phone}
                  onInput={handleInputChange}
                />
              </div>
              <div>
                <label for="specialRequests" class="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData().specialRequests}
                  onInput={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h2 class="font-medium mb-3">Payment Method</h2>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-300 rounded-md">
                <input type="radio" name="payment" class="h-4 w-4 text-indigo-600" checked />
                <span>Credit/Debit Card</span>
              </label>
              <label class="flex items-center space-x-3 p-3 border border-gray-300 rounded-md">
                <input type="radio" name="payment" class="h-4 w-4 text-indigo-600" />
                <span>PayPal</span>
              </label>
              <label class="flex items-center space-x-3 p-3 border border-gray-300 rounded-md">
                <input type="radio" name="payment" class="h-4 w-4 text-indigo-600" />
                <span>Bank Transfer</span>
              </label>
            </div>
          </div>

          <div class="mb-6 bg-white rounded-lg shadow p-4">
            <h2 class="font-medium mb-3">Order Summary</h2>
            <div class="space-y-2 mb-3">
              {cartItems.map((item) => (
                <div class="flex justify-between">
                  <span class="text-gray-600">{item.serviceName} - {item.packageName}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div class="border-t pt-2 space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors"
          onClick={handleSubmit}
        >
          Confirm Booking (${total.toFixed(2)})
        </button>
      </div>
    </div>
  );
}