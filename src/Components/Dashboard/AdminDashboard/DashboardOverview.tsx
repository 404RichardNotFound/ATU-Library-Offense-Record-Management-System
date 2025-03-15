import bookIcon from '../../../assets/books (1).png';
import studentIcon from '../../../assets/students.png';
import judgeIcon from '../../../assets/judge.png';
import programIcon from '../../../assets/lesson.png';

const DashboardOverview = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 max-sm:grid-cols-1 bg-zinc-100 max-lg:grid-cols-2 gap-4 p-1 w-full">
        <div className="flex shadow-md max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white p-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold">Total Students</h1>
            <h2 className="text-lg font-semibold">359</h2>
            <p className="text-xs font-medium">
              <span className="bg-green-500 text-white rounded-md pb-[2px] pt-[1px] mr-2 px-1.5">
                +3%
              </span>
              Since last month
            </p>
          </div>
          <div>
            <img src={studentIcon} className="w-12 h-12" alt="Team Icon" />
          </div>
        </div>
        <div className="flex shadow-md max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white p-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold">Programs</h1>
            <h2 className="text-lg font-semibold">25</h2>
            <p className="text-xs font-medium">
              <span className="bg-green-500 text-white rounded-md pb-[2px] pt-[1px] mr-2 px-1.5">
                +15%
              </span>
              Since last month
            </p>
          </div>
          <div>
            <img
              src={programIcon}
              className="w-[60px] h-[60px]"
              alt="Graduation Hat Icon"
            />
          </div>
        </div>
        <div className="flex shadow-md max-lg:w-full  w-full rounded-md h-auto items-center justify-between bg-white p-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold">Borrowed Books</h1>
            <h2 className="text-lg font-semibold">359</h2>
            <p className="text-xs font-medium">
              <span className="bg-red-500 text-white rounded-md pb-[2px] pt-[1px] mr-2 px-1.5">
                -15%
              </span>
              Since last month
            </p>
          </div>
          <div>
            <img src={bookIcon} className="w-12 h-12" alt="Book Icon" />
          </div>
        </div>
        <div className="flex shadow-md max-lg:w-full bg-white w-full rounded-md h-auto items-center justify-between p-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold">Offenses</h1>
            <h2 className="text-lg font-semibold">15</h2>
            <p className="text-xs font-medium">
              <span className="bg-green-500 text-white rounded-md pb-[2px] pt-[1px] mr-2 px-1.5">
                +20%
              </span>
              Since last month
            </p>
          </div>
          <div>
            <img src={judgeIcon} className="w-12 h-12" alt="Judge Icon" />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default DashboardOverview;
