"use client";

import React, { useState, useRef, useEffect } from "react";
import { PlusCircle, Search, Eye, EyeOff, Edit } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { fonts } from "@/components/ui/font";
import { ADDUSER } from "@/app/actions/adduser";
// import { UPDATEUSER } from "@/app/actions/updateuser"; // Uncomment if you have an update action

import { Button } from "@/components/ui/button";

const columns = [
  { accessorKey: "user", header: "User" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "status", header: "Status" },
  // {
  //   header: "Actions",
  //   cell: ({ row }) => (
  //     <Button
  //       onClick={() => handleEditUser(row.original)}
  //       size="sm"
  //       variant="secondary"
  //     >
  //       <Edit className="h-4 w-4" />
  //     </Button>
  //   ),
  // },
];
export default function UsersPage() {

  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    role: "",
    status: "",
    password: "",
  });
  const [isMounted, setIsMounted] = useState(false); // Prevent SSR mismatch
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const modalRef = useRef(null);

  // Fetch users from backend when component mounts
  async function fetchUsers() {
    try {
      const response = await fetch(
        "https://tradetoppers.esoftideas.com/esi-api/responses/users/"
      ); // Adjust to your actual API route
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      const userdata = data.Users || [];
      setUserData(userdata);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Set isMounted true on client to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const closeModal = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingUserId(null);
    // Reset form data
    setFormData({
      user: "",
      email: "",
      role: "",
      status: "",
      password: "",
    });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData(e.target);

    // Optimistically close the modal immediately after submit
    closeModal();

    if (isEditing) {
      // Update existing user
      try {
        // Uncomment and adjust if you have an UPDATEUSER action
        // const response = await UPDATEUSER(formDataToSubmit, editingUserId);
        // For demo purposes, we simulate a successful update:
        const response = { ok: true };

        if (response.ok) {
          // Update userData state with the edited details
          setUserData((prevData) =>
            prevData.map((user) =>
              user.id === editingUserId ? { ...user, ...formData } : user
            )
          );
        } else {
          throw new Error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      // Add new user
      try {
        const response = await ADDUSER(formDataToSubmit);
        console.log("Response from server:", response);

        if (response.ok) {
          // Create new user object (using a temporary id if necessary)
          const newUser = {
            user: formData.user,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            // The password is typically not stored in frontend state
          };
          setUserData((prevData) => [...prevData, newUser]);
        } else {
          throw new Error("Failed to add user");
        }
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditingUserId(user.id);
    setFormData({
      user: user.user,
      email: user.email,
      role: user.role,
      status: user.status,
      password: "", // For security, do not prefill password
    });
    setOpen(true);
  };

  const filteredUsers = userData.filter(
    (user) =>
      user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prevent hydration errors by not rendering until mounted
  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
          Users
        </h1>
        <button
          className={`flex items-center px-4 py-2 bg-black text-white rounded ${fonts.montserrat}`}
          onClick={() => {
            setOpen(true);
            setIsEditing(false);
            setFormData({
              user: "",
              email: "",
              role: "",
              status: "",
              password: "",
            });
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Add/Edit User Modal */}
      {open && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg p-6 w-[425px]">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="user"
                  className={`block ${fonts.montserrat} font-medium`}
                >
                  Name
                </label>
                <input
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`block ${fonts.montserrat} font-medium`}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className={`block ${fonts.montserrat} font-medium`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!isEditing} // When editing, password might not be required
                    className="w-full p-2 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="role"
                  className={`block ${fonts.montserrat} font-medium`}
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleSelectChange("role", e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select user role</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Marketer">Marketer</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className={`block ${fonts.montserrat} font-medium`}
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleSelectChange("status", e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select user status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <button
                type="submit"
                className={`w-full ${fonts.montserrat} bg-black text-white py-2 rounded`}
              >
                {isEditing ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className={`w-full ${fonts.montserrat} mt-2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400`}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* DataTable Component */}
      <DataTable columns={columns} data={filteredUsers} />
    </div>
  );
}
