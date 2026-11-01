import React, { useContext, useEffect, useState } from "react";
import { bookingData } from "../assets/assets.js";
import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Clock,
  XCircle,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { AppContext } from "../Context/AppContext.jsx";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { axios, navigate } = useContext(AppContext);
  const [bookingData, setBookingData] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/users");
      if (data.success) {
        setBookingData(data.bookings);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { 
    fetchMyBookings();
  },[]);

  const getStatusBgColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status = "") => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Bookings</h1>

          <p className="text-gray-600 text-lg">
            Here are your hotel bookings. You can view the details and manage
            your reservations.
          </p>
        </div>

        {/* Booking List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-6 bg-gray-50 px-6 py-4 border-b border-gray-100 font-semibold text-gray-700">
            <div className="md:col-span-4">Hotel & Room</div>
            <div className="md:col-span-3">Dates</div>
            <div className="md:col-span-2">Payment</div>
            <div className="md:col-span-2">Status</div>
            <div className="md:col-span-1">Actions</div>
          </div>

          {bookingData.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-800">
                No bookings yet
              </h2>
              <p className="mt-2">Your hotel reservations will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookingData.map((booking) => {
                const status = booking.status || "pending";
                const StatusIcon = getStatusIcon(status);

                return (
                  <div
                    key={booking._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Hotel & Room */}
                      <div className="md:col-span-4">
                        <div className="flex gap-4">
                          <img
                            src={`http://localhost:3000/images/${booking.room?.images?.[0]}`}
                            alt={booking.room?.roomType || "Hotel room"}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-lg mb-1">
                              {booking.hotel?.hotelName || "Hotel"}
                            </h3>

                            <p className="text-blue-600 font-medium mb-1">
                              {booking.room?.roomType || "Room"}
                            </p>

                            <div className="flex items-start gap-1 text-gray-500 text-sm mb-1">
                              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span>
                                {booking.hotel?.hotelAddress ||
                                  "Address unavailable"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Users className="w-4 h-4" />
                              <span>
                                {booking.persons ?? 1} Guest
                                {(booking.persons ?? 1) !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="md:col-span-3">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium text-gray-800">
                                {formatDate(booking.checkIn)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium text-gray-800">
                                {formatDate(booking.checkOut)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {booking.paymentMethod || "Not specified"}
                            </span>
                          </div>

                          <p className="font-bold text-lg text-gray-800">
                            ${booking.totalPrice ?? 0}
                          </p>

                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              booking.isPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <p>{booking.isPaid ? "Paid" : "Pay Now"}</p>
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="md:col-span-2">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium capitalize ${getStatusBgColor(status)}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
