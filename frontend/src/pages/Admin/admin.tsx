import "./admin.css";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { FaPhoneAlt } from "react-icons/fa";

// type for contact messages
interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const AdminPage = () => {
  // states for contact messages
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      // fetch contacts from backend API, importing backend URL from .env file
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contacts/`);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: number) => {
    try {
      // delete contact from backend API
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/contacts/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete contact");
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="pt-16">
      <Navbar />
      <div className="min-h-screen px-4 py-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Contact Messages
        </h1>

        {loading && (
          <p className="text-center text-gray-400 animate-pulse">Loading...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid sm:grid-rows-2 md:grid-rows-4 lg:grid-cols-6 gap-4 justify-items-center">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="max-w-xs w-full bg-white rounded-lg shadow hover:shadow-md p-4 transition duration-200"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">
                  {contact.first_name} {contact.last_name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{contact.email}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contact.email);
                    }}
                    className="text-white text-xs bg-blue-500 border-2 rounded-md px-1 hover:shadow-sm"
                  >
                    Copy
                  </button>
                </div>

                {contact.phone_number && (
                  <p className="text-sm text-gray-600 justify-start flex items-center gap-2">
                    <FaPhoneAlt />
                    {contact.phone_number}
                  </p>
                )}
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line break-words">
                  {contact.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(contact.created_at).toLocaleDateString("en-US", {})}
                </p>
              </div>
              <button
                onClick={() => deleteContact(contact.id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md w-fit self-end transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {contacts.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-10">No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
