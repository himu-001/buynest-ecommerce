import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { motion } from "motion/react";
import { MapPin, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AllHotels = () => {
  const { navigate, axios } = useContext(AppContext);

  const [hotelData, setHotelData] = useState([]);

  const fetchOwnerHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotel/get");

      if (data.success) {
        setHotelData(Array.isArray(data.data) ? data.data : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error(error.response?.data?.message || "Failed to fetch hotels");
    }
  };

  useEffect(() => {
    fetchOwnerHotels();
  }, []);

  const deleteHotel = async (id) => {
    try {
      const { data } = await axios.delete(`/api/hotel/delete/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchOwnerHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-2xl shadow-xl p-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Premium Hotels Collection
            </h1>
            <p className="text-gray-600">
              Discover exceptional stays around the world
            </p>
          </div>

          <motion.button
            type="button"
            className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/owner/register-hotel")}
            whileHover={{ scale: 1.05 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            Register Hotel
          </motion.button>
        </div>

        {/* Hotels Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Hotel Owner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Price/Night
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Amenities
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {(hotelData || []).map((hotel, index) => (
                  <tr
                    key={hotel._id ?? hotel.id ?? index}
                    className={`hover:bg-blue-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`http://localhost:3000/images/${hotel.image}`}
                          alt={hotel.hotelName || "Hotel"}
                          className="w-20 h-16 rounded-xl object-cover shadow-md"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {hotel.hotelName}
                        </h3>
                      </div>
                    </td>

                    <td className="py-6 px-6">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                        <span className="text-gray-600 text-sm">
                          {hotel.hotelAddress || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="py-6 px-6 text-gray-600 text-sm">
                      {hotel.owner?.name || "N/A"}
                    </td>

                    <td className="py-6 px-6 text-gray-600 text-sm">
                      {hotel.owner?.contactNumber || "+91 9234567890"}
                    </td>

                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{hotel.rating ?? "N/A"}</span>
                      </div>
                    </td>

                    <td className="py-6 px-6">
                      <span className="text-xl font-bold text-gray-800">
                        {hotel.price != null ? `$${hotel.price}` : "N/A"}
                      </span>
                    </td>

                    <td className="py-6 px-6">
                      <div className="flex flex-wrap gap-1 min-w-36">
                        {(Array.isArray(hotel.amenities)
                          ? hotel.amenities
                          : typeof hotel.amenities === "string"
                            ? hotel.amenities.split(",")
                            : []
                        )
                          .map((amenity) => amenity.trim())
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((amenity, i) => (
                            <span
                              key={`${amenity}-${i}`}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}

                        {(Array.isArray(hotel.amenities)
                          ? hotel.amenities
                          : typeof hotel.amenities === "string"
                            ? hotel.amenities.split(",")
                            : []
                        ).length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +
                            {(Array.isArray(hotel.amenities)
                              ? hotel.amenities
                              : hotel.amenities.split(",")
                            ).length - 3}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-6 px-6">
                      <button
                        type="button"
                        onClick={() => deleteHotel(hotel._id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {hotelData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      No hotels available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllHotels;
