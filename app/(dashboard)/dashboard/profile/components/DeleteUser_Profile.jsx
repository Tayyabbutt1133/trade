"use client";
import React, { useState } from "react";
import { DELETEUSER } from "@/app/actions/deleteuser";
import { useRouter } from "next/navigation";

const DeleteUser_Profile = ({ webcode }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("code", webcode);

      const response = await DELETEUSER(formdata);
      // console.log("User deleted:", response);

      if (response?.body == 'Success') {
        await fetch("/api/auth/user", { method: "DELETE" });
        window.location.href = "/"; // Force logout & redirect
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-32 font-medium text-sm rounded-md h-10 bg-black text-white"
      >
        Delete Profile
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your profile? This action is
              <strong> irreversible</strong> and your data will be removed from
              the platform.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUser_Profile;
