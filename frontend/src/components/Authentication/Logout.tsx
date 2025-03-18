import { useAuth0 } from "@auth0/auth0-react";
import "./Logout.css"

const Logout = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <button
        className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-center hover:bg-blue-700 transition"
        onClick={() => logout()}
      >
        Sign Out
      </button>
    )
  );
};

export default Logout;
