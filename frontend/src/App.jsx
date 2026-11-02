import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";

import Home from "./Pages/Home";
import Hotels from "./Pages/Hotels";
import Rooms from "./Pages/Rooms";
import SingleRoom from "./Pages/singleRoom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import About from "./Pages/About";
import MyBookings from "./Pages/MyBookings";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer.jsx";

import { Toaster } from "react-hot-toast";
import { AppContext } from "./Context/AppContext.jsx";

import OwnerLayout from "./Pages/Owner/OwnerLayout.jsx";
import AllHotels from "./Pages/Owner/AllHotels.jsx";
import RegisterHotel from "./Pages/Owner/RegisterHotel.jsx";
import AllRooms from "./Pages/Owner/AllRooms.jsx";
import AddRoom from "./Pages/Owner/AddRoom.jsx";
import Bookings from "./Pages/Owner/Bookings.jsx";

const App = () => {
  const location = useLocation();
  const ownerPath = location.pathname.includes("owner");

  const { owner } = useContext(AppContext);

  return (
    <div className="w-full mx-auto">
      {!ownerPath && <Navbar />}

      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:id" element={<SingleRoom />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/about" element={<About />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* OWNER ROUTES */}
        <Route
          path="/owner"
          element={owner ? <OwnerLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<AllHotels />} />

          <Route path="register-hotel" element={<RegisterHotel />} />

          <Route path="rooms" element={<AllRooms />} />

          <Route path="add-room" element={<AddRoom />} />

          <Route path="bookings" element={<Bookings />} />
        </Route>
      </Routes>

      {!ownerPath && <Footer />}
    </div>
  );
};

export default App;
