import userPhoto from '../../../assets/woman-photo.jpg';

const MyProfile = () => {
  return (
    <div className="flex flex-col max-lg:flex-col p-1 bg-zinc-100 h-full w-full gap-4">
      {/* Admin Profile */}
      <div className="flex max-sm:flex-col max-sm:items-center overflow-hidden border-2 max-lg:w-full p-3 gap-4 w-full bg-white rounded-md">
        <img
          src={userPhoto}
          className="w-24 h-24 rounded-full object-cover"
          alt=""
        />
        <div className="flex max-sm:text-center gap-1 max-md:gap-[2px] flex-col overflow-hidden">
          <p className="text-base">Jessica Davidson</p>
          <p className="text-sm">Accra Technical University</p>
          <p className="text-xs">Jessicadavid789@gmail.com</p>
          <p>Admin</p>
        </div>
      </div>
      {/* Edit Profile */}
      <form className="w-full flex h-[370px] flex-col rounded-md bg-white p-3 max-md:h-[370px] border-2">
        <div className="flex flex-col py-2 w-full justify-between gap-3">
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-slate-100 border-2 rounded-md  py-1 px-2 w-full"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="ID">ID</label>
              <input
                type="text"
                name="ID"
                id="ID"
                className="bg-slate-100 rounded-md py-1 px-2 w-full border-2"
                placeholder="ID"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                name="name"
                id="name"
                className="bg-slate-100 rounded-md py-1 px-2 w-full border-2"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="Phone Number">Phone number</label>
              <input
                type="tel"
                name="Phone"
                placeholder="Phone Number"
                id="Phone"
                className="bg-slate-100 rounded-md  py-1 px-2 w-full border-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end cursor-pointer mt-2">
          <input
            className="bg-blue-500 cursor-pointer rounded-md p-2 text-white font-medium hover:bg-blue-600"
            type="submit"
            value="Save Changes"
          />
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
