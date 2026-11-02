import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import {
  MapPin,
  Star,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  Utensils,
  Mountain,
  Eye,
  Building,
  TreePine,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

const SingleRoom = () => {
  const { id } = useParams();
  const { roomData, axios, navigate } = useContext(AppContext);

  const room = roomData?.find((r) => r._id === id);

  const [selectedImage, setSelectedImage] = useState(0);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    persons: 1,
  });

  const [isAvailable, setIsAvailable] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "checkIn" || name === "checkOut") {
      setIsAvailable(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Ocean View": Eye,
      "Mountain View": Mountain,
      "City View": Building,
      "Garden View": TreePine,
      Balcony: Building,
      "Mini Bar": Coffee,
      "Room Service": Utensils,
      "Free WiFi": Wifi,
      "Premium WiFi": Wifi,
      "Work Desk": Building,
      "Concierge Service": User,
      "Breakfast Included": Coffee,
      Parking: Car,
      "Smart TV": Tv,
      "Spa Access": Bath,
      "Pool Access": Bath,
      Kitchen: Utensils,
      "Living Area": Building,
      "Private Terrace": Building,
      "Butler Service": User,
      Jacuzzi: Bath,
      "Panoramic View": Eye,
      AirConditioning: Wind,
    };

    return iconMap[amenity.trim()] || CheckCircle;
  };

  const getAmenities = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities;
    }

    if (typeof amenities === "string" && amenities.trim()) {
      return amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const checkRoomAvailability = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (bookingData.checkIn < getTodayDate()) {
      toast.error("Check-in date cannot be in the past.");
      return;
    }

    if (bookingData.checkIn >= bookingData.checkOut) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: room._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available");
        }
      } else {
        setIsAvailable(false);
        toast.error(data.message || "Could not check availability.");
      }
    } catch (error) {
      setIsAvailable(false);
      console.error("Error checking room availability:", error);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      await checkRoomAvailability();
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/book", {
        room: room._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        persons: Number(bookingData.persons),
        paymentMethod: "Pay At Hotel",
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Error booking room:", error);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-700">Room not found</h1>
      </div>
    );
  }

  const roomImages = Array.isArray(room.images) ? room.images : [];
  const roomAmenities = getAmenities(room.amenities);
  const hotelAmenities = getAmenities(room.hotel?.amenities);

  const hotelName = room.hotel?.hotelName || room.hotel?.name || "Hotel";

  const hotelAddress =
    room.hotel?.hotelAddress || room.hotel?.address || "Not available";

  const ownerName = room.hotel?.owner?.name || room.hotel?.ownerName || "Owner";

  return (
    <div className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800">
                {room.roomType}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 mt-3">
                <MapPin className="w-5 h-5" />

                <span>{hotelAddress}</span>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />

                  <span className="font-medium">
                    {room.hotel?.rating ?? "N/A"}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    room.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.isAvailable ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Not available
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-3">
                ${room.pricePerNight}
                <span className="text-base font-normal text-gray-500">
                  /night
                </span>
              </div>

              <div className="text-gray-600">
                <div className="flex items-center gap-2 justify-end">
                  <User className="w-4 h-4" />
                  <span>{ownerName}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 justify-end">
                  <Phone className="w-4 h-4" />
                  <span>{room.hotel?.contactNumber || "Not available"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Room Gallery
          </h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* MAIN IMAGE */}

            <div className="lg:col-span-2">
              <div className="w-full aspect-video overflow-hidden rounded-xl bg-gray-100">
                {roomImages.length > 0 ? (
                  <img
                    src={`http://localhost:3000/images/${roomImages[selectedImage]}`}
                    alt={`${room.roomType} - Image ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No room images available
                  </div>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {roomImages.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3000/images/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 lg:h-28 w-full object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedImage === index
                      ? "ring-4 ring-blue-500 opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT + BOOKING */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}

          <div className="lg:col-span-2">
            {/* ABOUT ROOM */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                About This Room
              </h2>

              <p className="text-gray-600 leading-7">
                {room.description ||
                  `Experience luxury at its finest in our ${room.roomType}. This spacious room features premium amenities, stunning views, and elegant furnishings designed for your comfort. Perfect for couples, families, or business travelers who appreciate comfort and style.`}
              </p>
            </div>

            {/* ROOM AMENITIES */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Room Amenities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomAmenities.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-blue-600" />

                      <span className="text-gray-700 text-sm font-medium">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HOTEL AMENITIES */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Hotel Amenities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotelAmenities.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-blue-600" />

                      <span className="text-gray-700 text-sm font-medium">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HOTEL INFORMATION */}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                About This Hotel
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Hotel Name</p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {hotelName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Owner</p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {ownerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {hotelAddress}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact</p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {room.hotel?.contactNumber || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING CARD */}

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Book This Room
              </h2>

              <form onSubmit={onSubmitHandler}>
                {/* CHECK IN */}

                <div className="mb-5">
                  <label
                    htmlFor="checkIn"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Check-in Date
                  </label>

                  <input
                    type="date"
                    name="checkIn"
                    id="checkIn"
                    min={getTodayDate()}
                    value={bookingData.checkIn}
                    onChange={onChangeHandler}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* CHECK OUT */}

                <div className="mb-5">
                  <label
                    htmlFor="checkOut"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Check-out Date
                  </label>

                  <input
                    type="date"
                    name="checkOut"
                    id="checkOut"
                    min={bookingData.checkIn || getTodayDate()}
                    value={bookingData.checkOut}
                    onChange={onChangeHandler}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* GUESTS */}

                <div className="mb-6">
                  <label
                    htmlFor="persons"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Users className="w-4 h-4" />
                    Number of Guests
                  </label>

                  <input
                    id="persons"
                    name="persons"
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.persons}
                    onChange={onChangeHandler}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* PRICE */}

                <div className="border-t border-gray-200 pt-5 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price per night</span>

                    <span className="text-xl font-bold text-gray-800">
                      ${room.pricePerNight}
                    </span>
                  </div>
                </div>

                {/* BOOK BUTTON */}

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium transition bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  {isAvailable ? "Book Now" : "Check Availability"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRoom;
