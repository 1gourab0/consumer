// pages/Home.jsx
import { A } from "@solidjs/router";
import { createEffect, createSignal, For } from "solid-js";

// Sample data array (would normally come from API)
const services = [
  {
    "_id": "6855b140a78fbb99ee6e194a",
    "title": "Mehndi by Ayesha",
    "description": "Experienced mehndi artist for weddings, festivals, and private events. Specializes in intricate bridal designs.",
    "category": "beauty & personal care",
    "price": 100,
    "currency": "USD",
    "location": {
      "city": "New Delhi",
      "state": "Delhi"
    },
    "images": [
      "https://storage.googleapis.com/sample-bucket/uploads/bridal_mehndi.jpg"
    ],
    "serviceId": "ss_dwgkvuEvXi",
    "score": 28.23
  },
  // Add more sample services as needed
  {
    "_id": "6855b140a78fbb99ee6e194b",
    "title": "Wedding Photography",
    "description": "Professional wedding photography capturing your special moments with artistic flair.",
    "category": "photography",
    "price": 1500,
    "currency": "USD",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra"
    },
    "images": [
      "https://storage.googleapis.com/sample-bucket/uploads/wedding_photography.jpg"
    ],
    "serviceId": "ss_photography123",
    "score": 32.45
  }
];

export default function Home() {
  // Sort by score for recommended section
  const recommendedServices = () => [...services].sort((a, b) => b.score - a.score).slice(0, 4);

  const [popularServices, setPopularServices] = createSignal([]);
  const [latestServices, setLatestServices] = createSignal([]);

  const fetchPopularServices = async () => {
    const url = import.meta.env.VITE_MS_2;
    try {
      const res = await fetch(`${url}/services/popular?limit=4`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setPopularServices(data.results);
    } catch (error) {
      console.error("Error during search:", error);
      setPopularServices([]);
    }
  }

  const fetchLatestServices = async () => {
    const url = import.meta.env.VITE_MS_2;
    try {
      const res = await fetch(`${url}/services/latest?limit=2`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setLatestServices(data.results);
    } catch (error) {
      console.error("Error during search:", error);
      setLatestServices([]);
    }
  }

  createEffect(() => {
    fetchPopularServices();
    fetchLatestServices();
  })


  // Popular categories
  const categories = [
    { name: "Photography", icon: "📷" },
    { name: "Catering", icon: "🍽️" },
    { name: "Makeup", icon: "💄" },
    { name: "Venues", icon: "🏛️" }
  ];

  return (
    <div class="pb-16"> {/* Padding for bottom bar */}
      {/* Hero Section */}
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 ">
        <h1 class="text-3xl font-bold mb-2">Find Perfect Wedding Services</h1>
        <p class="mb-4">Discover trusted vendors for your special day</p>
        <A
          href="/services"
          class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium inline-block"
        >
          Browse Services
        </A>
      </div>

      {/* Categories */}
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4 text-purple-700">Popular Categories</h2>
        <div class="grid grid-cols-4 gap-2">
          {categories.map(category => (
            <A
              href={`/services?category=${encodeURIComponent(category.name)}`}
              class="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <span class="text-2xl mb-1">{category.icon}</span>
              <span class="text-xs text-center">{category.name}</span>
            </A>
          ))}
        </div>
      </div>

      {/* Recommended Services */}
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-purple-700">Recommended For You</h2>
          <A href="/services" class="text-indigo-600 text-sm">See All</A>
        </div>
        <div class="flex gap-4 overflow-x-auto">
          {popularServices().map(service => (
            <div class="flex-shrink-0 w-64">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>

      {/* Recently Added */}
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-purple-700">Recently Added</h2>
          <A href="/services" class="text-indigo-600 text-sm">See All</A>
        </div>
        <div class="flex gap-4 overflow-x-auto">
          {latestServices().map(service => (
            <div class="flex-shrink-0 w-64">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard(props) {

  return (
    <A
      href={`/service/${props.service.serviceId}`}
      class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 text-purple-800 w-64 flex-shrink-0"
    >
      {/* Image */}
      <div class="relative aspect-square">
        <img
          src={props.service.images[0]}
          alt={props.service.title}
          class="absolute inset-0 h-full w-full object-cover rounded-t-xl"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div class="p-4 space-y-2">
        {/* Title */}
        <h3 class="font-semibold text-base line-clamp-1">
          {props.service.title}
        </h3>

        {/* Location & Price */}
        <div class="flex justify-between items-center text-sm text-gray-600">
          <span>
            {props.service.location.city}, {props.service.location.state}
          </span>
        </div>

        {/* Rating + Reviews */}
        <div class="flex items-center text-sm mt-1 text-yellow-500">
          <div class="flex w-full items-center">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="ml-1 text-gray-800 font-medium">
              {(props.service.rating) ? props.service.rating.toFixed(1) : "0"}
            </span>
            <span class="ml-2 text-xs text-gray-500">
              ({props.service.reviewCount || 0} reviews)
            </span>
          </div>
          <span class="text-purple-800 font-bold">
            {props.service.currency}{props.service.price}
          </span>
        </div>
      </div>
    </A>

  );
}