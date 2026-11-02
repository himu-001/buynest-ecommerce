import React, { useContext } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { navigate, axios } = useContext(AppContext);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/users/signup", formData);

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-[350px] w-full mx-auto mt-36 text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
    >
      <h1 className="text-3xl mt-10 font-medium">Sign Up</h1>

      <p className="text-sm mt-2">Please sign up to continue</p>

      {/* Name */}
      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <User className="w-4 h-4 text-gray-500" />

        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="border-none outline-none ring-0 w-full"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email */}
      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <Mail className="w-4 h-4 text-gray-500" />

        <input
          type="email"
          name="email"
          placeholder="Email id"
          className="border-none outline-none ring-0 w-full"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Role */}
      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 focus-within:border-indigo-500 transition-colors">
        <User className="w-4 h-4 text-gray-500 shrink-0" />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer"
          required
        >
          <option value="" disabled>
            Select Role
          </option>

          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* Password */}
      <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <Lock className="w-4 h-4 text-gray-500" />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-none outline-none ring-0 w-full"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />
      </div>

      {/* Signup Button */}
      <button
        type="submit"
        className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
      >
        Sign Up
      </button>

      {/* Login */}
      <p className="text-gray-500 text-sm mt-3 mb-11">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-500 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default Signup;
