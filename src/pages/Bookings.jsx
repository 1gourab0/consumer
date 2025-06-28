// pages/Bookings.jsx
import { createEffect, createSignal } from 'solid-js';

// Sample bookings data with new structure
// const bookingsData = [
//   {
//     "_id": { "$oid": "68585c9cdd2144794c714311" },
//     "bookingId": "bk_Iag-P8FULP",
//     "consumerId": "user_123",
//     "consumerEmail": "user@example.com",
//     "bookingDate": { "$date": "2025-06-11T00:00:00.000Z" },
//     "groupName": "Pre-Wedding Full",
//     "items": [
//       {
//         "menuId": "menu_tijgfQv_uT",
//         "sellerId": "ss_YOGA001",
//         "price": 12000,
//         "currency": "INR",
//         "preferredDateRange": {
//           "from": { "$date": "2025-06-11T00:00:00.000Z" },
//           "to": { "$date": "2025-06-11T00:00:00.000Z" }
//         },
//         "preferredTime": {
//           "start": "09:00",
//           "end": "17:00"
//         },
//         "note": "both side"
//       }
//     ],
//     "status": "requested",
//     "amount": 12000,
//     "currency": "INR",
//     "payment": {
//       "status": "not_initiated",
//       "paymentIntentId": null,
//       "method": null,
//       "paidAt": null
//     },
//     "service": {
//       "title": "Pre-Wedding Photography Package",
//       "image": "https://images.unsplash.com/photo-1631621583126-ed10a80f62b1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       "category": "Photography"
//     }
//   },
//   // Additional sample bookings
//   {
//     "_id": { "$oid": "68585c9cdd2144794c714312" },
//     "bookingId": "bk_Confirmed123",
//     "consumerId": "user_123",
//     "bookingDate": { "$date": "2025-06-15T00:00:00.000Z" },
//     "groupName": "Bridal Makeup",
//     "items": [
//       {
//         "menuId": "menu_makeup001",
//         "sellerId": "ss_MAKEUP001",
//         "price": 8000,
//         "preferredTime": {
//           "start": "07:00",
//           "end": "10:00"
//         },
//         "note": "Traditional look"
//       }
//     ],
//     "currency": "INR",
//     "status": "confirmed",
//     "amount": 8000,
//     "payment": {
//       "status": "completed",
//       "paidAt": { "$date": "2025-06-10T14:30:00.000Z" }
//     },
//     "service": {
//       "title": "Bridal Makeup Service",
//       "image": "https://images.unsplash.com/photo-1684868682581-4cac3af5b8d4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       "category": "Beauty"
//     }
//   },
//   {
//     "_id": { "$oid": "68585c9cdd2144794c714313" },
//     "bookingId": "bk_Failed456",
//     "groupName": "Wedding Venue Booking",
//     "items": [
//       {
//         "menuId": "menu_venue001",
//         "price": 50000,
//         "preferredDateRange": {
//           "from": { "$date": "2025-07-01T00:00:00.000Z" },
//           "to": { "$date": "2025-07-03T00:00:00.000Z" }
//         }
//       }
//     ],
//     "currency": "INR",
//     "status": "failed",
//     "amount": 50000,
//     "payment": {
//       "status": "failed",
//       "paidAt": null
//     },
//     "service": {
//       "title": "Luxury Wedding Venue",
//       "image": "https://images.unsplash.com/photo-1749731894795-4eae105fa60a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       "category": "Venue"
//     }
//   }
// ];

export default function Bookings() {
  const [activeTab, setActiveTab] = createSignal("requested");
  const [bookingsData, setBookingsData] = createSignal([]);

  const url = import.meta.env.VITE_MS_3

  // Filter bookings based on active tab
  const filteredBookings = () => {
    const res = bookingsData()?.filter(item => item.status === activeTab());
    return res.length ? res : [];
  };

  const fetchBookings = async() => {
    try {
      const res = await fetch(`${url}/user_123`, {
        headers: {
          "Authorization": `Bearer mock-dev-token`,
          "Content-Type": "application/json",
          "x-env": "testing"
        }
      })
      const data = await res.json()
      setBookingsData(data);
    } catch (er) {
      console.log("Error fetching bookings:", er);
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    const date = new Date(dateString.$date || dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time range
  const formatTimeRange = (time) => {
    if (!time) return "Time not specified";
    return `${time.start} - ${time.end}`;
  };

  createEffect(() => {
    fetchBookings();
  })


  return (
    <div class="pb-16"> {/* Padding for bottom bar */}
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-6 text-purple-700">My Bookings</h1>

        {/* Status Tabs */}
        <div class="flex border-b border-gray-200 mb-6">
          <button
            class={`px-4 py-2 font-medium text-sm ${activeTab() === "requested" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("requested")}
          >
            Requested
          </button>
          <button
            class={`px-4 py-2 font-medium text-sm ${activeTab() === "accepted" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted
          </button>
          <button
            class={`px-4 py-2 font-medium text-sm ${activeTab() === "confirmed" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("confirmed")}
          >
            Confirmed
          </button>
          <button
            class={`px-4 py-2 font-medium text-sm ${activeTab() === "failed" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("failed")}
          >
            Failed
          </button>
        </div>


        {/* Bookings List */}
        <div class="space-y-4">
          {filteredBookings()?.length > 0 ? (
            filteredBookings().map(booking => (
              <div class="bg-white rounded-lg shadow p-4 text-purple-800">
                <div class="flex items-start">
                  <img
                    src={booking.image}
                    alt={booking.title}
                    class="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <div>
                        <h3 class="font-semibold">{booking.groupName}</h3>
                        <p class="text-xs text-gray-500">{booking.title}</p>
                      </div>
                      <span class={`text-xs px-2 py-1 h-fit rounded-2xl ${booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                          booking.status === "failed" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                        }`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div class="mt-2 text-sm">
                      {booking.items.map(item => (
                        <div class="mb-2">
                          <p>
                            <span class="font-medium">Date: </span>
                            {item.preferredDateRange ?
                              `${formatDate(item.preferredDateRange.from)} - ${formatDate(item.preferredDateRange.to)}` :
                              formatDate(booking.bookingDate)}
                          </p>
                          <p>
                            <span class="font-medium">Time: </span>
                            {formatTimeRange(item.preferredTime)}
                          </p>
                          {item.note && (
                            <p>
                              <span class="font-medium">Note: </span>
                              {item.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div class="flex justify-between items-center mt-3">
                      <span class="font-bold">
                        {booking.currency} {booking.amount.toLocaleString()}
                      </span>
                      <div class="flex space-x-2">
                        {booking.status === "accepted" && (
                          <>
                            <button class="text-xs bg-indigo-600 text-white px-3 py-1 rounded">
                              Pay Now
                            </button>
                            <button class="text-xs border border-gray-300 px-3 py-1 rounded">
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === "requested" && (
                          <button class="text-xs border border-gray-300 px-3 py-1 rounded">
                            View Details
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button class="text-xs border border-gray-300 px-3 py-1 rounded">
                            View Details
                          </button>
                        )}
                        {booking.status === "failed" && (
                          <button class="text-xs bg-indigo-600 text-white px-3 py-1 rounded">
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div class="text-center py-10">
              <p class="text-gray-500">
                {activeTab() === "requested" ? "No requested bookings" :
                  activeTab() === "accepted" ? "No accepted bookings" :
                    activeTab() === "confirmed" ? "No confirmed bookings" :
                      "No failed bookings"}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}