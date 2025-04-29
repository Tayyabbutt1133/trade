"use client";

import Container from "@/components/container";
import React, { useState, useEffect } from "react";
import { CONTACT } from "@/app/actions/createContact";

export default function ContactUsPage() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userWebcode, setUserWebcode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    designation: "",
    remarks: "",
  });
  const [status, setStatus] = useState(null);

  // Fetch designation list
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/designation/"
        );
        const data = await response.json();
        setDesignations(data?.Designations || []);
      } catch (error) {
        console.error("Error fetching designations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignations();
  }, []);

  // Fetch user webcode from cookie and hit profile API to auto-fill form
  useEffect(() => {
    const fetchWebcodeAndProfile = async () => {
      try {
        // Step 1: Get webcode from your own API
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        const webcode = data?.userData?.webcode;

        if (webcode) {
          setUserWebcode(webcode);

          // Step 2: Fetch profile from external API
          const formdata = new FormData();
          formdata.append("code", webcode);

          const profileResponse = await fetch(
            "https://tradetoppers.esoftideas.com/esi-api/responses/profile/",
            {
              method: "POST",
              body: formdata,
            }
          );

          const profileData = await profileResponse.json();
          console.log("Profile data :", profileData);
          const user = profileData?.Registeration?.[0];
          console.log("User from Contact", user);

          // Step 3: Auto-fill form if user is not an Admin
          if (user && user.type !== "Admin") {
            setFormData({
              name: user.name || "",
              email: user.email || "",
              contact: user.poccontact || "",
              designation: user.designation || "",
              remarks: "", // Keep remarks empty
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user webcode or profile:", error);
      }
    };

    fetchWebcodeAndProfile();
  }, []);

  // Handle all form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    try {
      const response = await CONTACT(payload);

      if (response.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          contact: "",
          designation: "",
          remarks: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  return (
    <Container>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-6">
          Please fill out the form below to get in touch with us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="designation" className="block mb-2 font-semibold">
              Designation *
            </label>
            {loading ? (
              <p>Loading designations...</p>
            ) : (
              <select
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select your designation</option>
                {designations.map((designation) => (
                  <option key={designation.id} value={designation.value}>
                    {designation.designation}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block mb-2 font-semibold">
              Contact No *
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="remarks" className="block mb-2 font-semibold">
              Message *
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your message"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-fit bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Submitting..." : "Submit"}
          </button>

          {status === "success" && (
            <p className="text-green-600 mt-2">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">
              Something went wrong. Try again.
            </p>
          )}
        </form>
      </div>
    </Container>
  );
}
