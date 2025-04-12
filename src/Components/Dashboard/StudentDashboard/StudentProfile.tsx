import userPhoto from '../../../assets/profile-picture.png';
import { Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@radix-ui/themes';

const StudentProfile = () => {
  //State for student details
  const [student, setStudent] = useState<any>('');
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem('activeStudentId');

    if (!id) {
      navigate('/StudentLogin');
      return;
    }

    const stored = sessionStorage.getItem(`student_${id}`);
    if (!stored) {
      navigate('/StudentLogin');
      return;
    }

    try {
      const student = JSON.parse(stored);
      setStudent(student);
    } catch (err) {
      sessionStorage.removeItem(`student_${id}`);
      navigate('/StudentLogin');
    }
  }, [navigate]);

  //Display Spinner component while fetching student data
  if (!student)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col max-lg:flex-col p-1 bg-zinc-100 h-full w-full gap-4">
      {/* Student Profile */}
      <div className="flex max-sm:flex-col border-neutral-300 max-sm:items-center overflow-hidden border-[1px] max-lg:w-full px-3 py-4 gap-5 w-full bg-white rounded-md">
        <img
          src={student.profileImage || userPhoto}
          className="w-24 h-24 border-2 rounded-full object-cover"
          alt="User Icon"
        />
        <div className="flex justify-center max-sm:text-center max-md:gap-[1px] flex-col overflow-hidden">
          <p className="text-[17px]">{student.Name}</p>
          <p>Accra, Ghana</p>
          <div>
            <Tag className="w-14 mt-1 text-center font-medium" color="blue">
              {student.Role}
            </Tag>
          </div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="flex flex-col gap-2 py-3 bg-white rounded-md border-[1px] border-neutral-300">
        <div className="flex justify-between items-center py-1 px-4">
          <h1 className="text-[16px] truncate">Personal Information</h1>
          <Link to="/StudentDashboard/EditStudentProfile">
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
            <p className=" lg:text-base">{student.Name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Email Address</h2>
            <p className="lg:text-base">{student.Email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Phone Number</h2>
            <p className="lg:text-base">
              <span className="mr-1">(+233)</span>
              {student.PhoneNumber}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">ID</h2>
            <p className=" lg:text-base">{student.ID}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Role</h2>
            <p className="lg:text-base">{student.Role}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Program</h2>
            <p className="lg:text-base">{student.Program}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Gender</h2>
            <p className="lg:text-base">{student.Gender}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="opacity-60">Joined Date</h2>
            <p className="lg:text-base">{student.JoinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
