import { createResource, createEffect } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";

async function fetchMenuDetail(id) {
    const url = import.meta.env.VITE_MS_2;
    const res = await fetch(`${url}/menu/${id}`);
    if (!res.ok) throw new Error("Failed to load service details");
    const data = await res.json();
    if (data?.total === 0) {
        throw new Error("Service not found");
    }
    return data;
}

export default function MenuDetails() {
    const params = useParams();
    const navigate = useNavigate();
    const [menu] = createResource(() => params.id, fetchMenuDetail);


    createEffect(() => {
        // if (id.state === "ready") {
        //   console.log("Fetched services:", services());
        // }

        console.log("Menu ID:", menu());
    });

    return (
        <div class="max-w-3xl p-6 bg-white rounded-lg shadow-md mt-6 pb-44">
            <Show when={menu()}>
                {(data) => {
                    const service = data().data;
                    return (
                        <>
                            {/* Service Header */}
                            <div class="mb-6">
                                <h1 class="text-2xl font-bold text-gray-800">{service.name}</h1>
                                <p class="text-sm text-gray-500">Service Type: <span class="font-medium">{service.serviceType}</span></p>
                                <p class="text-gray-600 mt-2">{service.description}</p>
                                <p class="mt-2 text-xl font-semibold text-indigo-600">₹{service.price} {service.currency}</p>
                            </div>

                            {/* Items */}
                            <div class="mb-6">
                                <h2 class="text-lg font-semibold text-gray-700 mb-2">What's Included:</h2>
                                <ul class="space-y-4">
                                    {service.items.map((item, index) => (
                                        <li class="border p-4 rounded-md" key={index}>
                                            <h3 class="font-semibold text-gray-800">{item.title}</h3>
                                            <p class="text-sm text-gray-600">{item.description}</p>
                                            <div class="mt-1 text-sm text-gray-500">
                                                Quantity: {item.quantity} {item.unit} — ₹{item.price}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Custom Options */}
                            <div>
                                <h2 class="text-lg font-semibold text-gray-700 mb-2">Custom Options</h2>
                                <ul class="text-sm text-gray-600 space-y-1">
                                    <li>
                                        <strong>Extra Photos:</strong>{" "}
                                        {service.customOptions?.extraPhotos?.enabled ? "Enabled" : "Disabled"} (₹
                                        {service.customOptions?.extraPhotos?.price}/photo)
                                    </li>
                                    <li>
                                        <strong>Delivery Time:</strong> {service.customOptions?.deliveryTime}
                                    </li>
                                    <li>
                                        <strong>Supports Revisions:</strong>{" "}
                                        {service.customOptions?.supportsRevisions ? "Yes" : "No"}
                                    </li>
                                </ul>
                            </div>
                        </>
                    );
                }}
            </Show>
            <Show when={menu()}>
                <div class="fixed bottom-20 left-0 px-6 p-4 flex items-center gap-2 bg-gray/10 backdrop-blur-sm w-full">
                    <A
                        href={`/service/slots?serviceId=${params.id}&package=${menu().data.menuId}`}
                        class="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Proceed
                    </A>
                </div>
            </Show>
        </div>
    );
}
