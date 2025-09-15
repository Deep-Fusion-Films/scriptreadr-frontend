import { useState, useEffect } from "react";
import { checkAuthToken } from "../util";
import { useNavigate } from "react-router-dom";
import { useToken } from "../store/AuthContext";

export default function Contact() {
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { setToken } = useToken();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });

  console.log(formData);

  const handleFormData = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitFormData = async (event) => {
    event.preventDefault();
    setIsSending(true);

    const info = {
      fullname: formData.fullname,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    const token = await checkAuthToken();

    if (!token) {
      setToken(null);
      navigate("/signin");
      return;
    }
    setToken(token);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/contact/contact_us/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(info),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("An error occured");
      }

      setMessage(data.detail);
    } catch (err) {
      setError("An unespected error occured, please try again later");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main>
      <section className="py-16 px-4 bg-white rounded-xl max-w-4xl mx-auto my-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2E3A87] mb-8">Contact Us</h2>
          {message ? (
            <h2 className="text-green-500">{message}</h2>
          ) : error ? (
            <h2 className="text-red-500">{error}</h2>
          ) : (
            ""
          )}
        </div>

        <form onSubmit={handleSubmitFormData} className="space-y-6">
          {/* Full Name and Email - stacked by default, side-by-side only on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleFormData}
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormData}
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleFormData}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
              placeholder="Subject"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleFormData}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
              placeholder="Your message..."
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSending}
              className="bg-[#2E3A87] text-white py-2 px-6 rounded hover:bg-[#1f2c6b] transition"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
