"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { PlusCircle, Search, Eye, EyeOff, Edit, Loader2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { fonts } from "@/components/ui/font";
import { ADDUSER } from "@/app/actions/adduser";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

const columns = [
  { accessorKey: "user", header: "User" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "status", header: "Status" },
];

export default function UsersPage() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    role: "",
    status: "",
    password: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [ShowRouteLoader, setShowRouteLoader] = useState();

  const modalRef = useRef(null);

  // Fetch users from backend
  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch(
        "https://tradetoppers.esoftideas.com/esi-api/responses/users/"
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUserData(data.Users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const closeModal = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({ user: "", email: "", role: "", status: "", password: "" });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    closeModal();

    if (isEditing) {
      try {
        const response = { ok: true };
        if (response.ok) {
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
      try {
        const response = await ADDUSER(new FormData(e.target));
        if (response.ok) {
          setUserData((prevData) => [...prevData, { ...formData }]);
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
      password: "",
    });
    setOpen(true);
  };

  const filteredUsers = userData.filter(
    (user) =>
      user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isMounted) return null;

  const handleClick = () => {
    setShowRouteLoader(true); // show loading
    startTransition(() => {
      router.push("/dashboard/seller/new");
    });
  };

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader />}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1
            className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}
          >
            Users
          </h1>
          <button
            className={`flex items-center px-4 py-2 bg-black text-white rounded ${fonts.montserrat}`}
            onClick={() => {
              setOpen(true);
              setIsEditing(false);
              handleClick;
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

        {open && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-[425px]">
              <h2 className="text-lg font-semibold mb-4">
                {isEditing ? "Edit User" : "Add New User"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    name="user"
                    value={formData.user}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!isEditing}
                      className="w-full p-2 border rounded pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded"
                >
                  {isEditing ? "Update User" : "Add User"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full mt-2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
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

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          <DataTable columns={columns} data={filteredUsers} />
        )}
      </div>
    </>
  );
}
