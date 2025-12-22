"use client";

import { Profile, useAuth } from "@/hooks/auth";
import { capitalize } from "@/utils";
import { useState } from "react";

export default function AccountSettings({ user }: { user: Profile }) {
  const [first_name, setFirstName] = useState(user.first_name || "");
  const [last_name, setLastName] = useState(user.last_name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [street_address, setStreetAddress] = useState(
    user.street_address || ""
  );
  const [city, setCity] = useState(user.city || "");
  const [region, setRegion] = useState(user.region || "");
  const [postal_code, setPostalCode] = useState(user.postal_code || "");

  const { updateProfile } = useAuth();
  const { mutate, isPending } = updateProfile;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;
    const profile: Profile = {
      ...user,
      ...updates,
      id: user.id,
    };

    if (profile.phone && profile.phone.length < 10) {
      alert("number can't be less than 10");
    }

    mutate(profile);
  };

  function Capitalize(e: string) {
    return e.charAt(0).toUpperCase() + e.slice(1);
  }
  return (
    <div className="bg-white p-8 border border-gray-100 animate-fade-in max-w-2xl">
      <h2 className="text-xl font-serif italic text-gray-900 mb-8">
        Account Preferences
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              First Name
            </label>
            <input
              name="first_name"
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              value={capitalize(first_name)}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              Last Name
            </label>
            <input
              name="last_name"
              onChange={(e) => setLastName(e.target.value)}
              value={capitalize(last_name)}
              type="text"
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={user.email}
            disabled
            className="w-full border-b border-gray-200 py-2 text-sm text-gray-400 cursor-not-allowed bg-transparent"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
            Phone Number
          </label>
          <div className="flex">
            <span className="py-2 text-sm text-gray-400 border-b border-gray-200 pr-2 select-none">
              +233
            </span>
            <input
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              value={phone}
              placeholder="XX XXX XXXX"
              className="flex-1 border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-900">
            Delivery Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Ghana Post GPS Address
              </label>
              <input
                name="postal_code"
                onChange={(e) => setPostalCode(e.target.value)}
                type="text"
                value={postal_code}
                placeholder="GH-000-0000"
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:normal-case"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                  Region
                </label>
                <select
                  name="region"
                  onChange={(e) => setRegion(e.target.value)}
                  value={region}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent transition-colors appearance-none rounded-none"
                >
                  <option value="">Select Region</option>
                  <option value="greater-accra">Greater Accra</option>
                  <option value="ashanti">Ashanti</option>
                  <option value="central">Central</option>
                  <option value="eastern">Eastern</option>
                  <option value="western">Western</option>
                  <option value="western-north">Western North</option>
                  <option value="volta">Volta</option>
                  <option value="oti">Oti</option>
                  <option value="bono">Bono</option>
                  <option value="bono-east">Bono East</option>
                  <option value="ahafo">Ahafo</option>
                  <option value="northern">Northern</option>
                  <option value="savannah">Savannah</option>
                  <option value="north-east">North East</option>
                  <option value="upper-east">Upper East</option>
                  <option value="upper-west">Upper West</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                  City / Town
                </label>
                <input
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  placeholder="e.g. East Legon"
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Street Address
              </label>
              <input
                name="street_address"
                onChange={(e) => setStreetAddress(e.target.value)}
                type="text"
                value={street_address}
                placeholder="P.O. Box or Street Name"
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            role="button"
            disabled={isPending}
            className="px-8 py-3 bg-[#0a1f35] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#153250] transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
