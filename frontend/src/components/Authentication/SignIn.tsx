import { useAuth0 } from "@auth0/auth0-react";
import "./SignIn.css"

const SignIn = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <button
        className="bg-[#434343] text-white px-5 py-2.5 rounded-lg text-center hover:bg-gray-500 transition"
        onClick={() => loginWithRedirect()}
      >
        Sign In
      </button>
    )
  );
};

export default SignIn;