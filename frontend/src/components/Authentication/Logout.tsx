import { useAuth0 } from "@auth0/auth0-react";
import "./Logout.css";

const Logout = () => {
  const { logout, isAuthenticated, user } = useAuth0();

  return (
    isAuthenticated && (
      <div>
        <div className="relative group inline-block">
          <button
            className="flex items-center space-x-4 bg-[#434343] text-white px-5 py-2.5 rounded-lg text-center hover:bg-gray-500 transition"
            onClick={() => logout()}
          >
            {user?.picture && (
              <img
                src={user.picture}
                alt="User Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            )}
            {user?.name && <h2>{user.name}</h2>}
          </button>

          {/*tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 text-sm text-white bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Click To Sign Out
          </div>
        </div>
      </div>
    )
  );
};

export default Logout;
