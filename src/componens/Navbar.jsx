// components/Navbar.jsx
import { A } from "@solidjs/router";

export default function Navbar() {
  return (
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <A href="/" class="text-xl font-bold text-indigo-600">
              CelebrateHub
            </A>
          </div>
          <div class="flex items-center space-x-4">
            <A href="/orders" class="text-gray-600 hover:text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </A>
            <A href="/cart" class="text-gray-600 hover:text-indigo-600 relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </A>
          </div>
        </div>
      </div>
    </nav>
  );
}