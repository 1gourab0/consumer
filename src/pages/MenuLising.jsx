// pages/MenuListing.jsx
import { A, useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";

const packages = {
  1: [
    {
      id: 101,
      name: "Basic Package",
      price: 299,
      description: "4 hours coverage, 100 edited photos, online gallery",
      features: [
        "1 photographer",
        "Digital images",
        "Basic editing"
      ]
    },
    {
      id: 102,
      name: "Premium Package",
      price: 599,
      description: "8 hours coverage, 300 edited photos, photo book",
      features: [
        "2 photographers",
        "Digital images + prints",
        "Advanced editing",
        "Photo book"
      ]
    },
    {
      id: 103,
      name: "Deluxe Package",
      price: 899,
      description: "Full day coverage, 500+ edited photos, premium album",
      features: [
        "2 photographers + assistant",
        "All digital images",
        "Premium editing",
        "Leather-bound album",
        "Engagement session"
      ]
    }
  ]
};

async function fetchMenuDetail(id) {
  console.log(id)
  const url = import.meta.env.VITE_MS_2
  const res = await fetch(`${url}/services/${id}`);
  if (!res.ok) throw new Error("Failed to load service details");
  const data = await res.json();
  if (data?.total === 0) {
    throw new Error("Service not found");
  }
  return data
}

export default function MenuListing() {
  const params = useParams();
  const navigate = useNavigate();
  const [services] = createResource(() => params.id, fetchMenuDetail);

  createEffect(() => {
    if (services) {
      console.log("Fetched services:", services());
    }
  })

  return (
    <div class="p-4 tex-slae-800">
      <h1 class="text-xl font-bold mb-4">Available Packages</h1>

      <div class="space-y-4">
        <Show when={services()?.menus?.length}>
          {services()?.menus?.map((item) => (
            <div class="bg-white rounded-lg shadow p-4 text-purple-800">
              {console.log(item)}
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg text-slate-800">{item.name}</h3>
                <span class="text-indigo-600 font-bold">{item.price}</span>
              </div>
              <p class="text-gray-600 mb-3">{item.menuId}</p>

              {/* <ul class="space-y-1 mb-4">
                {item.features.map((feature) => (
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul> */}

              <div class="flex gap-2">
                <A
                  href={`/service/${params.id}/menu/details/${item.menuId}`}
                  class="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </A>
                <A
                  href={`/service/slots?serviceId=${params.id}&package=${item.menuId}`}
                  class="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors"
                >
                  Select Time Slot
                </A>
              </div>
            </div>
          ))}
        </Show>

      </div>
    </div>
  );
}