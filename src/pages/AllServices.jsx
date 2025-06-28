// pages/AllServices.jsx
import { A } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";

const services = [
    { id: 1, name: "Photography", icon: "📷", count: 45 },
    { id: 2, name: "Catering", icon: "🍽️", count: 32 },
    { id: 3, name: "Makeup Artists", icon: "💄", count: 28 },
    { id: 4, name: "Venues", icon: "🏛️", count: 19 },
    { id: 5, name: "Decorations", icon: "🎀", count: 27 },
    { id: 6, name: "Entertainment", icon: "🎤", count: 15 },
    { id: 7, name: "Florists", icon: "🌸", count: 22 },
    { id: 8, name: "Invitations", icon: "✉️", count: 12 },
];

const url = import.meta.env.VITE_MS_2

export default function AllServices() {
    const [searchTerm, setSearchTerm] = createSignal("");
    const [results, setResults] = createSignal([]);
    let debounceTimeout;

    createEffect(() => {
        const term = searchTerm().trim();

        // Debounce logic
        clearTimeout(debounceTimeout);

        if (term) {
            debounceTimeout = setTimeout(async () => {
                try {
                    console.log(url)
                    const res = await fetch(`${url}/services?q=${encodeURIComponent(term)}`);
                    if (!res.ok) throw new Error("Failed to fetch services");
                    const data = await res.json();
                    setResults(data);
                } catch (error) {
                    console.error("Error during search:", error);
                    setResults([]);
                }
            }, 400); // 400ms debounce
        } else {
            setResults([]); // Clear results if input is empty
        }
    });

    return (
        <div class="p-4 pb-20"> {/* Added padding-bottom for mobile nav */}
            {/* Search Section */}
            <div class="mb-6">
                <div class="relative w-full">
                    <input
                        type="text"
                        placeholder="Search services..."
                        class="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm()}
                        onInput={(e) => setSearchTerm(e.currentTarget.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Results Section */}
            <Show
                when={searchTerm() && results()?.total !== 0}
                fallback={
                    <div class="text-center py-10">
                        <Show
                            when={searchTerm()}
                            fallback={<p class="text-gray-500">Search for services above</p>}
                        >
                            <p class="text-gray-500">No services found matching "{searchTerm()}"</p>
                        </Show>
                    </div>
                }
            >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results()?.results?.map((service) => (
                        <A
                            href={`/service/${service.serviceId}`}
                            class="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow text-purple-900"
                        >
                            <img
                                src={service.images?.[0] || "/placeholder-service.jpg"}
                                alt={service.title}
                                class="w-24 h-24 object-cover rounded-full mb-3"
                            />
                            <h3 class="font-semibold text-center text-lg">{service.title}</h3>
                            <p class="text-sm text-gray-500 text-center line-clamp-2">
                                {service.description}
                            </p>
                            <span class="text-sm mt-2 text-blue-600 font-medium">
                                {service.location?.city}, {service.location?.state}
                            </span>
                        </A>
                    ))}
                </div>
            </Show>

        </div>
    );
}