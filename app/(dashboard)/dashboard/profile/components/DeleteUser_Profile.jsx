"use client";
import React, { useState } from "react";
import { DELETEUSER } from "@/app/actions/deleteuser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DeleteUser_Profile = ({ webcode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("code", webcode);

      const response = await DELETEUSER(formdata);

      if (response?.body === "Success") {
        // Delete the user session and redirect to home page
        await fetch("/api/auth/user", { method: "DELETE" });
        window.location.href = "/"; // Force logout & redirect
      } else {
        // Handle error case
        console.error("Failed to delete user:", response);
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-32 font-medium text-sm rounded-md h-10 bg-black text-white"
        type="button" // Important: set type to button to prevent form submission
      >
        Delete Profile
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your profile? This action is
              <strong> irreversible</strong> and your data will be removed from
              the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              type="button"
              className="bg-green-600 hover:bg-green-900"
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteUser_Profile;
