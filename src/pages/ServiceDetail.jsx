import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal } from "solid-js";

async function fetchServiceDetail(id) {
  const url = import.meta.env.VITE_MS_2;
  const res = await fetch(`${url}/services/${id}`);
  if (!res.ok) throw new Error("Failed to load service details");
  const data = await res.json();
  if (data?.total === 0) {
    throw new Error("Service not found");
  }
  return data
}

export default function ServiceDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = createSignal("details");
  const [service] = createResource(() => params.id, fetchServiceDetail);


  // Booking function: navigates to slot selection
  const bookNow = () => {
    navigate(`/service/${params.id}/slots`);
  };

  return (
    <div>
      {service.loading && <p class="p-4">Loading...</p>}
      {service.error && <p class="p-4 text-red-600">Error loading service.</p>}
      {service() && (
        <>
          <div class="relative">
            <img src={service().images?.[0]} alt={service().title} class="w-full h-48 object-cover" />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20"></div>
            <h1 class="absolute bottom-4 left-4 text-white text-xl font-bold">{service().title}</h1>
          </div>

          <div class="p-4">
            <div class="flex items-center mb-4">
              <div class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                ⭐ {service().averageRating || "N/A"}
              </div>
              <span class="text-gray-500 ml-2"> {service().reviewCount || 0} Reviews </span>
            </div>

            {/* Tabs */}
            <div class="flex border-b mb-4">
              {["details", "reviews", "provider"].map(tab => (
                <button
                  class={`px-4 py-2 font-medium ${activeTab() === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab: Details */}
            {activeTab() === "details" && (
              <div>
                <p class="text-gray-700 mb-4">{service().description}</p>
                <p class="text-sm text-gray-500 mb-2">
                  Category: <span class="text-black">{service().category}</span>
                </p>
                <p class="text-sm text-gray-500 mb-2">
                  Location: <span class="text-black">{service().location.city}, {service().location.state}</span>
                </p>
                <p class="text-sm text-gray-500 mb-4">
                  Price: <span class="text-black">{service().currency} {service().price}</span>
                </p>

              </div>
            )}


            {/* Tab: Provider */}
            {activeTab() === "provider" && (
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-bold text-lg mb-2">Provider Info</h3>
                <div class="text-gray-600 mb-1">Seller ID: {service().sellerId}</div>
                <div class="text-gray-600 mb-1">
                  Location: {service().location.city}, {service().location.state}
                </div>
                <div class="text-gray-600">
                  Available: {service().availability.days.join(", ")} | {service().availability.timeSlots.join(", ")}
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab() === "reviews" && (
              <div>
                <p class="text-sm text-gray-500 mb-4">No reviews available.</p>
                <button class="w-full border border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  See All Reviews
                </button>
              </div>
            )}
          </div>


          <div class="fixed bottom-20 flex items-center gap-2 w-full px-6 py-2">
            <button
              onClick={() => navigate(`/service/${params.id}/menu`)}
              class="block w-full text-indigo-600 border border-indigo-600 py-3 px-4 rounded-lg text-center font-medium hover:bg-indigo-50 transition-colors"
            >
              View Menus
            </button>
            <button
              onClick={bookNow}
              class="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
