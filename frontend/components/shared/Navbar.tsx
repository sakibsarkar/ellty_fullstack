import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { useLogoutMutation } from "redux/features/auth/auth.api";
import { logout } from "redux/features/auth/auth.slice";
import { useAppSelector } from "redux/hook";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const [logoutUser, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (isLoading) return;
    setIsDropDownOpen(false);
    await logoutUser(undefined);
    dispatch(logout(undefined));
  };

  return (
    <header className="w-full mb-[20px] py-[20px]">
      <nav className="max-w-[1440px] mx-auto flex items-center justify-between">
        <h3 className="text-4xl font-bold">LOGO</h3>

        {user ? (
          <div className="relative">
            {/* Avatar Button */}
            <button
              onClick={() => setIsDropDownOpen(!isDropDownOpen)}
              className="w-[45px] h-[45px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary border-2 border-transparent"
            >
              <img src="/avatar.jpg" alt="avatar" />
            </button>

            {/* Dropdown */}
            {isDropDownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl py-3 border border-gray-100 z-50">
                <div className="px-4 pb-2 border-b">
                  <p className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">@{user.userName}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="flex items-center justify-center gap-[10px]">
            <li>
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-primary">
                Register
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
