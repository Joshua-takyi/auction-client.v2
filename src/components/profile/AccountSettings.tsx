"use client";

interface AccountSettingsProps {
  user: any;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="bg-white p-8 border border-gray-100 animate-fade-in max-w-2xl">
      <h2 className="text-xl font-serif italic text-gray-900 mb-8">
        Account Preferences
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue={user.fullName?.split(" ")[0]}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={user.fullName?.split(" ")[1]}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user.email}
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
              type="tel"
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
                type="text"
                placeholder="GA-000-0000"
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:normal-case"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                  Region
                </label>
                <select className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent transition-colors appearance-none rounded-none">
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
                  type="text"
                  placeholder="e.g. East Legon"
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Street / Postal Address
              </label>
              <input
                type="text"
                placeholder="P.O. Box or Street Name"
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button className="px-8 py-3 bg-[#0a1f35] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#153250] transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
