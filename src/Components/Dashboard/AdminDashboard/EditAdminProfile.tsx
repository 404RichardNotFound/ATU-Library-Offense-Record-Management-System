const EditAdminProfile = () => {
  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      <form className="rounded-md border-[1px] border-zinc-200 bg-white h-[600px] w-full max-sm:w-full p-6 flex flex-col gap-3">
        <h1 className="text-center font-medium text-lg">Edit Profile</h1>

        {/* Student Information */}
        <div className="flex flex-col w-full gap-4">
          <div className="text-base w-full flex gap-2 flex-col">
            <label>Name:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="adminName"
              placeholder="Name"
              required
            />
          </div>
          <div className="text-base flex gap-2 w-full flex-col">
            <label>ID:</label>
            <input
              className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
              type="text"
              placeholder="ID"
              name="adminID"
              required
            />
          </div>
          <div className="text-base flex gap-2 w-full flex-col">
            <label>Email:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="email"
              placeholder="Email"
              name="program"
              required
            />
          </div>
          <div className="text-base flex gap-2 w-full flex-col">
            <label>Role:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              placeholder="Admin"
              name="Role"
              disabled
              required
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-base">Gender:</label>
          <div className="flex gap-4 text-base">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="gender" value="Male" />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="gender" value="Female" />
              Female
            </label>
          </div>
        </div>
        <div className="text-base flex gap-2 w-full flex-col">
          <label>Phone Number:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
            type="tel"
            placeholder="Phone Number"
            name="Phone Number"
            required
          />
        </div>

        {/* Submit Button with Loading Spinner */}
        <div className="flex gap-2 mt-1 justify-start">
          <button
            type="submit"
            className="border-2 transition-colors duration-300 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Edit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminProfile;
