import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToken } from "../store/AuthContext";
import { checkAuthToken } from "../util";
import CancelSubscriptionPopUp from "./CancelSubscriptionPopUp";
import DeleteAccountPopUp from "../components/DeleteAccountPopUp";
import { useSubscription } from "../store/SubcriptionContext";

export default function UserProfile() {
  const { setToken } = useToken();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [newFirstName, setNewFirstName] = useState(firstName);

  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [newLastName, setNewLastName] = useState(lastName);

  const [cancelPopUp, setCancelPopUp] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);

  const { currentSubscription, isFetching, fetchError } = useSubscription();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await checkAuthToken();

        if (!token) {
          setToken(null);
          throw new Error("No valid access token");
        }

        setToken(token);
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/user/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    };
    fetchUser();
  }, [isEditingFirstName, isEditingLastName]);

  //...............functions for updating first Name

  //handle toggle firstname input box
  const handleToggleFirstName = () => {
    setIsEditingFirstName(true);
  };

  //handle change first name text box and store it in state
  const handleChangeFirstName = (e) => {
    setNewFirstName(e.target.value);
  };

  //handle update first name
  const handleEditFirstName = async () => {
    const payload = {
      first_name: newFirstName,
    };

    if (!payload.first_name) {
      setIsEditingFirstName(false);
      return;
    }

    try {
      setIsSaving(true);
      const token = await checkAuthToken();

      if (!token) {
        setToken(null);
        throw new Error("No valid access token");
      }

      setToken(token);
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/user/users/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      //setFirstName(data.first_name);
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setIsSaving(false);
      setIsEditingFirstName(false);
    }
  };

  //.........functions for updating the lastName..................
  const handleToggleLastName = () => {
    setIsEditingLastName(true);
  };

  const handleChangeLastName = (e) => {
    setNewLastName(e.target.value);
  };

  //handle update first name
  const handleEditLastName = async () => {
    const payload = {
      last_name: newLastName,
    };

    if (!payload.last_name) {
      setIsEditingLastName(false);
      return;
    }

    try {
      setIsSaving(true);
      const token = await checkAuthToken();

      if (!token) {
        throw new Error("No valid access token");
      }

      setToken(token);
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/user/users/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setIsSaving(false);
      setIsEditingLastName(false);
    }
  };

  const handleCancelSubscriptionPopUp = () => {
    setCancelPopUp(true);
  };

  const handleShowDeletePopUp = () => {
    setDeletePopUp(true);
  };

  return (
    <main>
      <div className="min-h-screen bg-gray-50">
        <CancelSubscriptionPopUp
          cancelPopUp={cancelPopUp}
          setCancelPopUP={setCancelPopUp}
        />
        <DeleteAccountPopUp
          deletePopUp={deletePopUp}
          setDeletePopUp={setDeletePopUp}
        />
        {/* Account Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-left">Account</h1>

          {/* First Name */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <form action="">
                <label className="block font-semibold text-gray-700">
                  First Name
                </label>

                {isEditingFirstName && (
                  <input
                    type="text"
                    name="newFirstName"
                    value={newFirstName}
                    onChange={handleChangeFirstName}
                    className="text-gray-900 mt-1 border"
                  />
                )}
                {!isEditingFirstName && (
                  <p className="text-gray-900 mt-1">{firstName}</p>
                )}
              </form>
            </div>

            {/* {!isEditingFirstName && (
            <button
              onClick={handleToggleFirstName}
              className="mt-2 md:mt-0 text-white px-4 py-1 rounded-2xl bg-[#5C6BC0] hover:bg-[#3F4C9A] hover:cursor-pointer"
            >
              Update
            </button>
          )} */}

            {isEditingFirstName && (
              <button
                disable={isSaving}
                onClick={handleEditFirstName}
                className="mt-2 md:mt-0 text-white px-4 py-1 rounded-2xl bg-[#5C6BC0] hover:bg-[#3F4C9A] hover:cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <label className="block font-semibold text-gray-700">
                Last Name
              </label>

              {isEditingLastName && (
                <input
                  type="text"
                  name="newLastName"
                  value={newLastName}
                  onChange={handleChangeLastName}
                  className="text-gray-900 mt-1 border"
                />
              )}
              {!isEditingLastName && (
                <p className="text-gray-900 mt-1">{lastName}</p>
              )}
            </div>
            {/* 
          {!isEditingLastName && (
            <button
              onClick={handleToggleLastName}
              className="mt-2 md:mt-0 text-white px-4 py-1 rounded-2xl bg-[#5C6BC0] hover:bg-[#3F4C9A] hover:cursor-pointer "
            >
              Update
            </button>
          )}

          {isEditingLastName && (
            <button
              disabled={isSaving}
              onClick={handleEditLastName}
              className="mt-2 md:mt-0 text-white px-4 py-1 rounded-2xl bg-[#5C6BC0] hover:bg-[#3F4C9A] hover:cursor-pointer "
            >
              {isSaving ? "Save..." : "Save"}
            </button>
          )} */}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700">Email</label>
            <p className="text-gray-900 mt-1">{email}</p>
          </div>

          {/* Subscription Section */}
          <div className="mb-6">
            <label className="flex justify-between font-semibold text-gray-700">
              Subscription:
              <span className="text-green-600 font-medium border rounded-2xl px-4 py-1 bg-[#5C6BC0] text-white">
                {isFetching
                  ? "Fetching plan..."
                  : currentSubscription
                  ? `${currentSubscription.current_plan}`
                  : fetchError || "No subscription found."}
              </span>
            </label>

            <div className="mt-4 space-y-2">
              <button
                className="text-red-600 hover:underline block"
                onClick={handleCancelSubscriptionPopUp}
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="border-t pt-6 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <button
                onClick={handleShowDeletePopUp}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete Account
              </button>
              <p className="text-sm text-gray-500 mt-2 md:mt-0 md:ml-4">
                Before deleting your account, make sure to cancel any
                subscription you have.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
