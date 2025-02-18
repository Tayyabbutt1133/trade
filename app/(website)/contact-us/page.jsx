"use client";

import Container from "@/components/container";
import React from "react";

export default function ContactUsPage() {
    return (
      <Container>
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6">
        Please fill out the form below to get in touch with us.
      </p>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 font-semibold">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-2 font-semibold">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Your message"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-fit bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Submit
        </button>
      </form>
            </div>
            </Container>
  );
}
