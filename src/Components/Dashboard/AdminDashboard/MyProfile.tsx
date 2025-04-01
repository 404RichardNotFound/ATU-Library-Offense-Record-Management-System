import userPhoto from '../../../assets/woman-photo.jpg';
import { Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@radix-ui/themes';

const MyProfile = () => {
  //State for admin details
  const [admin, setAdmin] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem('admin');

    if (!storedAdmin) {
      navigate('/AdminLogin'); // Redirect to login if not logged in
      return;
    }

    try {
      const adminData = JSON.parse(storedAdmin);
      setAdmin(adminData);
    } catch (error) {
      console.error('Error parsing admin data:', error);
      sessionStorage.removeItem('admin'); // Clear invalid data
      navigate('/AdminLogin');
    }
  }, [navigate]);

  //Display Spinner component while fetching admin data
  if (!admin)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col max-lg:flex-col p-1 bg-zinc-100 h-full w-full gap-4">
      {/* Admin Profile */}
      <div className="flex max-sm:flex-col max-sm:items-center overflow-hidden border-[1px] max-lg:w-full p-3 gap-4 w-full bg-white rounded-md">
        <img
          src={userPhoto}
          className="w-24 h-24 border-2 rounded-full object-cover"
          alt=""
        />
        <div className="flex justify-center max-sm:text-center max-md:gap-[1px] flex-col overflow-hidden">
          <p className="text-[17px] font-medium">{admin.name}</p>
          <p>Accra, Ghana</p>
          <div>
            <Tag className="w-14 mt-1 text-center font-medium" color="blue">
              {admin.role}
            </Tag>
          </div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="flex flex-col gap-2 py-3 bg-white rounded-md border-[1px]">
        <div className="flex justify-between items-center py-1 px-4">
          <h1 className="text-[16px] truncate">Personal Information</h1>
          <Link to="/AdminDashboard/EditAdminProfile">
            <button className="text-[14px] transition-colors duration-300 items-center gap-1 flex hover:bg-blue-600 font-semibold bg-blue-500 text-white px-4 py-1 border-2 rounded-sm">
              Edit
              <EditIcon className="w-4 h-4 mt-[1px]" />
            </button>
          </Link>
        </div>
        <div className="px-4">
          <hr />
        </div>
        <div className="grid grid-cols-3 max-sm:gap-6 gap-8 p-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Name</h2>
            <p className=" lg:text-base">{admin.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Email Address</h2>
            <p className="lg:text-base">{admin.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Phone Number</h2>
            <p className="lg:text-base">
              <span className="mr-1">(+233)</span>
              {admin.phoneNumber}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">ID</h2>
            <p className=" lg:text-base">{admin.adminID}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Role</h2>
            <p className="lg:text-base">{admin.role}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Gender</h2>
            <p className="lg:text-base">{admin.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
