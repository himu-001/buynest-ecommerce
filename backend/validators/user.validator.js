const validateRegisterUser = (email, name, password, role) => {
  if ([email, name, password, role].some((field) => !field?.trim())) {
    return "All fields are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }

  const nameRegex = /^[a-zA-Z ]{2,50}$/;

  if (!nameRegex.test(name.trim())) {
    return "Name must contain 2-50 letters and spaces only";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  if (!passwordRegex.test(password)) {
    return "Password must contain uppercase, lowercase and a number";
  }

  const allowedRoles = ["user", "owner"];

  if (!allowedRoles.includes(role)) {
    return "Invalid role";
  }

  return null;
};

export { validateRegisterUser };
