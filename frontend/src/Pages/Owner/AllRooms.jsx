import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { motion } from "motion/react";
import { MapPin, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AllRooms = () => {
  const { navigate, axios } = useContext(AppContext);

  const [roomData, setRoomData] = useState([]);

  const fetchOwnerRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/get");

      if (data.success) {
        setRoomData(Array.isArray(data.data) ? data.data : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchOwnerRooms();
  }, []);

  const deleteRoom = async (id) => {
    try {
      const { data } = await axios.delete(`/api/room/delete/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchOwnerRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-2xl shadow-xl p-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Your All Rooms
            </h1>
            <p className="text-gray-600">Manage your rooms here</p>
          </div>

          <motion.button
            type="button"
            className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/owner/add-room")}
            whileHover={{ scale: 1.05 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            Add New Room
          </motion.button>
        </div>

        {/* Room Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Location
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
                {roomData.map((room, index) => {
                  const amenities = Array.isArray(room.amenities)
                    ? room.amenities
                    : typeof room.amenities === "string"
                      ? room.amenities.split(",")
                      : [];

                  return (
                    <tr
                      key={room._id ?? room.id ?? index}
                      className={`hover:bg-blue-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={`http://localhost:3000/images/${room.images?.[0] ?? ""}`}
                            alt={room.roomType || "Room"}
                            className="w-20 h-16 rounded-xl object-cover shadow-md"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {room.hotel?.hotelName || "N/A"}
                            </h3>
                          </div>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                          <span className="text-gray-600 text-sm">
                            {room.roomType || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-6 text-gray-600 text-sm">
                        {room.hotel?.hotelAddress || "N/A"}
                      </td>

                      <td className="py-6 px-6 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{room.hotel?.rating ?? "N/A"}</span>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2">
                          <span>
                            {room.pricePerNight != null
                              ? `$${room.pricePerNight}`
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex flex-wrap gap-1 min-w-36">
                          {amenities
                            .map((amenity) => String(amenity).trim())
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

                          {amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <button
                          type="button"
                          onClick={() => deleteRoom(room._id)}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {roomData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No rooms available yet.
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

export default AllRooms;
