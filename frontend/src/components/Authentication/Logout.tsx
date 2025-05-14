import { useAuth0 } from "@auth0/auth0-react";
import "./Logout.css";

const Logout = () => {
  const { logout, isAuthenticated, user } = useAuth0();

  return (
    isAuthenticated && (
      <div>
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
          {user?.name && (
            <h2>{user?.name}</h2>
          )}
          
        </button>
      </div>
    )
  );
};

export default Logout;
