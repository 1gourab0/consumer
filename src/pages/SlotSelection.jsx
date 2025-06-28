// pages/SlotSelection.jsx
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { createSignal, createEffect, For } from "solid-js";

export default function SlotSelection() {
  const [searchParams] = useSearchParams();
  const menuId = searchParams.package;
  const serviceId = searchParams.serviceId;
  const navigate = useNavigate()
  const [selectedStartDate, setSelectedStartDate] = createSignal(null);
  const [selectedEndDate, setSelectedEndDate] = createSignal(null);
  const [startTime, setStartTime] = createSignal("09:00");
  const [endTime, setEndTime] = createSignal("17:00");
  const [note, setNote] = createSignal("");
  const [currentMonth, setCurrentMonth] = createSignal(new Date());
  const [availableDates, setAvailableDates] = createSignal([]);

  const url = import.meta.env.VITE_MS_3;
  const devurl = "http://localhost:3333/booking";

  const handleDateClick = (date) => {
    if (!selectedStartDate()) {
      setSelectedStartDate(date);
    } else if (!selectedEndDate() && date >= selectedStartDate()) {
      setSelectedEndDate(date);
    } else if (date < selectedStartDate()) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  // const isDateAvailable = (date) => {
  //   return availableDates().includes(date);
  // };

  const isDateSelected = (date) => {
    if (!selectedStartDate()) return false;
    if (!selectedEndDate()) return date === selectedStartDate();
    return date >= selectedStartDate() && date <= selectedEndDate();
  };

  const isFirstSelected = (date) => {
    return date === selectedStartDate();
  };

  const isLastSelected = (date) => {
    return date === selectedEndDate();
  };

  const isInSelectionRange = (date) => {
    if (!selectedStartDate() || !selectedEndDate()) return false;
    return date > selectedStartDate() && date < selectedEndDate();
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth());
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderCalendar = () => {
    const year = currentMonth().getFullYear();
    const month = currentMonth().getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const weeks = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const days = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
          days.push(<div class="h-10"></div>);
        } else {
          const currentDate = new Date(year, month, day);
          const dateStr = currentDate.toISOString().split('T')[0];
          // const isAvailable = isDateAvailable(dateStr);

          days.push(
            <button
              onClick={() => handleDateClick(dateStr)}
              class={`relative h-10 w-10 rounded-full flex items-center justify-center
                ${isDateSelected(dateStr) ? 'bg-indigo-600 text-white' : ''}
                ${isInSelectionRange(dateStr) ? 'bg-indigo-200' : ''}
              ${isFirstSelected(dateStr) ? 'rounded-r-none' : ''}
                ${isLastSelected(dateStr) ? 'rounded-l-none' : ''}
                ${isInSelectionRange(dateStr) ? 'rounded-none' : ''}
              `}
            // disabled={!isAvailable}
            >
              {day}
              {isFirstSelected(dateStr) && (
                <div class="absolute left-0 top-0 bottom-0 w-5 bg-indigo-200 -z-10"></div>
              )}
              {isLastSelected(dateStr) && (
                <div class="absolute right-0 top-0 bottom-0 w-5 bg-indigo-200 -z-10"></div>
              )}
            </button>
          );
          day++;
        }
      }

      weeks.push(<div class="grid grid-cols-7 gap-1">{days}</div>);
      if (day > daysInMonth) break;
    }

    return weeks;
  };

  const handleAddToCart = () => {
    // const bookingDetails = getBookingDetails();
    alert(`Added to cart: Dummy}`);
  };

  const handleBookNow = async () => {
    if (!selectedStartDate() || !selectedEndDate()) {
      alert("Please select a valid date range.");
      return;
    }
    if (!startTime() || !endTime()) {
      alert("Please select a valid time range.");
      return;
    }

    const payload = {
      consumerId: "user_123",
      consumerEmail: "user@example.com",
      bookingDate: selectedStartDate(), // or today's date if you prefer
      preferredDateRange: {
        from: selectedStartDate(),
        to: selectedEndDate() || selectedStartDate(),
      },
      preferredTime: {
        start: startTime(),
        end: endTime(),
      },
      note: note(),
      groupName: "Pre-Wedding Full", // optional, you can make this dynamic too
      item: {
        menuId: menuId,
        sellerId: "ss_YOGA001",
        price: 12000,
        currency: "INR",
        preferredDateRange: {
          from: selectedStartDate(),
          to: selectedEndDate() || selectedStartDate(),
        },
        preferredTime: {
          start: startTime(),
          end: endTime(),
        },
        note: note(),
        addedAt: new Date().toISOString(),
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "nocart": "true"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      alert("Booking successful!");
      console.log("Server response:", result);

    } catch (error) {
      alert("Booking failed: " + error.message);
      console.error("Booking error:", error);
    }
  };

  return (
    <div class={`p-4 ${selectedStartDate() ? "pb-48" : 'pb-10'}  max-w-md mx-auto`}>

      <div>
        <h1 class="text-xl font-bold mb-6 text-purple-800">Select Time Slot</h1>

        <div class="mb-8 bg-white rounded-xl shadow-md p-4 text-purple-800">
          <div class="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              class="p-2 rounded-full hover:bg-gray-100"
            >
              &lt;
            </button>
            <h2 class="font-medium text-lg">
              {currentMonth().toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              class="p-2 rounded-full hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>

          <div class="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div>{day}</div>
            ))}
          </div>

          <div class="space-y-1">
            {renderCalendar()}
          </div>
        </div>

        <div class="mb-8">
          <h2 class="font-medium mb-3 text-purple-800">⏰ Preferred time</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <select
                value={startTime()}
                onChange={(e) => setStartTime(e.target.value)}
                class="w-full p-2 border border-gray-300 rounded-lg text-purple-800"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const hour = 8 + i;
                  const time = `${hour.toString().padStart(2, '0')}:00`;
                  const display = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                  return <option value={time}>{display}</option>;
                })}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <select
                value={endTime()}
                onChange={(e) => setEndTime(e.target.value)}
                class="w-full p-2 border border-gray-300 rounded-lg text-purple-800"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const hour = 9 + i;
                  const time = `${hour.toString().padStart(2, '0')}:00`;
                  const display = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                  return <option value={time}>{display}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="font-medium mb-3 text-purple-800">📝 Note for provider</h2>
          <textarea
            value={note()}
            onInput={(e) => setNote(e.target.value)}
            placeholder="Any special requests or instructions..."
            class="w-full p-3 border border-gray-300 rounded-lg h-24"
          />
        </div>
      </div>

      {selectedStartDate() && (
        <div class="fixed h-[200px] bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg max-w-md mx-auto text-purple-800">
          <div class="flex justify-between items-center mb-3">
            <span class="font-medium">Selected:</span>
            <span class="text-right">
              {formatDate(selectedStartDate())}
              {selectedEndDate() && selectedEndDate() !== selectedStartDate() && (
                <> - {formatDate(selectedEndDate())}</>
              )}
              <br />
              {startTime()} - {endTime()}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-purple-800">
            <button
              onClick={() => handleAddToCart()}
              class="w-full bg-gray-200 text-gray-800 py-2 px-4 text-sm rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              📥 Add to Cart
            </button>
            <button
              onClick={() => handleBookNow()}
              class="w-full bg-indigo-600 text-white py-2 px-4 text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              📘 Book Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}