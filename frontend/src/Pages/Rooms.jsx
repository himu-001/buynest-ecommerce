import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import RoomCard from "../Components/RoomCard";

const Rooms = () => {
  const { roomData } = useContext(AppContext);

  return (
    <div className="py-24 max-w-7xl mx-auto">
      <h1>All Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto mt-12 gap-6">
        {(roomData ?? []).map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
