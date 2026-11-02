import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
import { toast } from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({children}) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [owner, setOwner] = useState(null);
    const [hotelData, setHotelData] = useState([]);
    const [roomData, setRoomData] = useState([]);

    const checkUserLoginStatus = async () => { 
        try {
            const { data } = await axios.get("/api/users/is-auth");
            if (data.success) {
                setUser(true);
            }
        } catch (error) {
            console.error("Error checking user login status:", error);
        }
    }

    const fetchHotelsData = async() => {
        try {
      const { data } = await axios.get("/api/hotel/get-all");
      if (data.success) {
        setHotelData(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }
    }

    const fetchRoomsData = async() => {
        try {
            const { data } = await axios.get("/api/room/get-all");
            if (data.success) {
                toast.success(data.message);
                setRoomData(data.rooms);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchHotelsData();
        fetchRoomsData();
     }, []);

    const value = { navigate, user, setUser, owner, setOwner, hotelData, roomData, axios };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;