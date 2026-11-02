import { Warehouse, CalendarArrowDown } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";
import { Link, Outlet, useLocation } from "react-router-dom";

const OwnerLayout = () => {
  const dashboardicon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
      />
    </svg>
  );

  const { owner, setOwner, axios, navigate } = useContext(AppContext);
  const location = useLocation();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");

      if (data.success) {
        toast.success(data.message);
        setOwner(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardicon },
    { name: "Rooms", path: "/owner/rooms", icon: <Warehouse /> },
    {
      name: "Booking",
      path: "/owner/bookings",
      icon: <CalendarArrowDown />,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to="/owner">
          <img className="h-9" src={assets.logo} alt="Logo" />
        </Link>

        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Owner</p>

          <button
            type="button"
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
          {sidebarLinks.map((item) => {
            const isActive =
              item.path === "/owner"
                ? location.pathname === "/owner"
                : location.pathname === item.path ||
                  location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                to={item.path}
                key={item.path}
                className={`flex items-center py-3 px-4 gap-3
                                    ${
                                      isActive
                                        ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                                        : "hover:bg-gray-100/90 border-white text-gray-700"
                                    }`}
              >
                {item.icon}
                <p className="md:block hidden text-center">{item.name}</p>
              </Link>
            );
          })}
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default OwnerLayout;
