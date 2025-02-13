"use client";

import React, { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { fonts } from "@/components/ui/font";
import { ADDUSER } from "@/app/actions/adduser";

export default function UsersPage() {
  const columns = [
    { accessorKey: "user", header: "User" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status" },
    // { accessorKey: "lastLogin", header: "Last Login" },
  ];

  const [userData, setUserData] = useState([]);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      id: (userData.length + 1).toString(),
      ...formData,
      lastLogin: "N/A",
    };
    const formDataToSubmit = new FormData(e.target);
    const response = await ADDUSER(formDataToSubmit);
    console.log("Response from server :", response);

    setUserData((prevData) => [...prevData, newUser]);
    setOpen(false);
    resetForm();
  };

  const filteredUsers = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
          Users
        </h1>
        <button
          className={`flex  items-center px-4 py-2 bg-black text-white rounded ${fonts.montserrat}`}
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Add User Modal */}
      {open && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[425px]">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium">
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
                <label htmlFor="email" className="block font-medium">
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
                <label htmlFor="role" className="block font-medium">
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
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block font-medium">
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
                className="w-full bg-black text-white py-2 rounded"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
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

      {/* DataTable Component */}
      <DataTable columns={columns} data={filteredUsers} />
    </div>
  );
}