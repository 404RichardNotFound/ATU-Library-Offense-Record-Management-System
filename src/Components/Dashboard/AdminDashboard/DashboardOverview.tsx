import bookIcon from '../../../assets/books-stack-of-three.png';
import CountUp from 'react-countup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import studentIcon from '../../../assets/learning.png';
import judgeIcon from '../../../assets/yellow-card.png';
import programIcon from '../../../assets/training-program.png';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import { useEffect, useState } from 'react';

// Define colors
const COLORS = ['#3C81FF', '#ffc75f']; // Blue for Male, Pink for Female

// Define the structure of the offense data for the bar chart

const DashboardOverview = () => {
  // State variables for counts
  const [studentCount, setStudentCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [offenseCount, setOffenseCount] = useState(0);
  const [offenseData, setOffenseData] = useState([]);
  const [genderData, setGenderData] = useState([
    { name: 'Male', value: 0 },
    { name: 'Female', value: 0 },
  ]);

  // Fetch counts from Firestore when component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Count Students
        const studentSnap = await getDocs(collection(db, 'Students'));
        setStudentCount(studentSnap.size);

        // Count Gender Distribution (Male and Female)
        let maleCount = 0;
        let femaleCount = 0;

        studentSnap.forEach((doc) => {
          const data = doc.data();
          const gender = data.Student_Gender; // Assuming the gender field exists

          if (gender === 'Male') {
            maleCount++;
          } else if (gender === 'Female') {
            femaleCount++;
          }
        });

        setGenderData([
          { name: 'Male', value: maleCount },
          { name: 'Female', value: femaleCount },
        ]);

        console.log(genderData);

        // Count Programs - Documents where the "programs" field is not empty
        const studentsWithProgramsSnap = await getDocs(
          query(
            collection(db, 'Students'),
            where('Student_Program', '!=', null)
          )
        );
        setProgramCount(studentsWithProgramsSnap.size);

        // Count Borrowed Books
        const booksSnap = await getDocs(collection(db, 'BorrowedBooks'));
        setBookCount(booksSnap.size);

        // Count Offenses
        const offenseSnap = await getDocs(collection(db, 'OffenseList'));
        setOffenseCount(offenseSnap.size);

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        const offensesByMonth: { [key: string]: number } = {};

        offenseSnap.forEach((doc) => {
          const data = doc.data();
          const offenseDate = data.offenseDate; // format: 'DD/MM/YYYY'

          if (offenseDate && typeof offenseDate === 'string') {
            const [_day, month, _year] = offenseDate.split('/'); // Split by '/'
            const monthIndex = parseInt(month, 10) - 1; // convert "04" -> 3
            const monthName = monthNames[monthIndex];

            if (!offensesByMonth[monthName]) {
              offensesByMonth[monthName] = 0;
            }

            offensesByMonth[monthName] += 1;
          }
        });

        // Convert to array in order (Jan to Dec)
        const offenseArray: any = monthNames.map((month) => ({
          month,
          count: offensesByMonth[month] || 0,
        }));

        setOffenseData(offenseArray);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);
  return (
    <div className="w-full h-full bg-zinc-100">
      <div className="grid grid-cols-4 max-sm:grid-cols-1 bg-zinc-100 max-lg:grid-cols-2 gap-4 p-1 w-full">
        <div className="flex text-black border-[1px] border-neutral-300 max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Total Students</h1>
            <h2 className="text-lg font-bold">
              <CountUp
                start={0}
                end={studentCount}
                duration={4}
                separator=","
              />
            </h2>
          </div>
          <div>
            <img src={studentIcon} className="w-12 h-12" alt="Team Icon" />
          </div>
        </div>
        <div className="flex border-[1px] border-neutral-300 max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white text-black py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Total Programs</h1>
            <h2 className="text-lg font-bold">
              <CountUp
                start={0}
                end={programCount}
                duration={4}
                separator=","
              />
            </h2>
          </div>
          <div>
            <img
              src={programIcon}
              className="w-11 h-11"
              alt="Graduation Hat Icon"
            />
          </div>
        </div>
        <div className="flex max-lg:w-full border-neutral-300 w-full rounded-md h-auto items-center justify-between bg-white text-black py-5 px-3 border-[1px]">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">TotalBorrowed Books</h1>
            <h2 className="text-lg font-bold">
              <CountUp start={0} end={bookCount} duration={4} separator="," />
            </h2>
          </div>
          <div>
            <img src={bookIcon} className="w-11 h-11" alt="Book Icon" />
          </div>
        </div>
        <div className="flex border-[1px] border-neutral-300 max-lg:w-full bg-white text-black w-full rounded-md h-auto items-center justify-between py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Total Offenses</h1>
            <h2 className="text-lg font-bold">
              <CountUp
                start={0}
                end={offenseCount}
                duration={4}
                separator=","
              />
            </h2>
          </div>
          <div>
            <img src={judgeIcon} className="w-12 h-12" alt="Judge Icon" />
          </div>
        </div>
      </div>
      <div className="pt-4 w-full bg-zinc-100 gap-4 flex justify-between max-lg:flex-col">
        {/*Bar Chart*/}
        <div className="w-full p-3 py-6 border-[1px] border-neutral-300 rounded-lg bg-white">
          <h2 className="text-lg text-center mb-4">Offense Overview</h2>
          <ResponsiveContainer className="-ml-4" width="100%" height={300}>
            <BarChart data={offenseData} className="p-3">
              <CartesianGrid strokeDasharray="3 3" className="opacity-0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3C81FF" name="Total Offenses" />
            </BarChart>
          </ResponsiveContainer>

          {/* Custom Legend for better spacing */}
          <div className="flex flex-wrap justify-center mt-4 space-x-3 sm:space-x-10">
            {[{ name: 'Offenses', color: '#3C81FF' }].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: item.color }}
                ></div>
                {/* Square */}
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Pie Chart */}
        <div className="w-1/2 max-lg:w-full p-4 border-[1px] border-neutral-300 rounded-lg bg-white">
          <h2 className="text-lg text-center mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60} // Creates a donut effect
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                } // Shows labels inside slices
              >
                {genderData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom Legend for better spacing */}
          <div className="flex flex-wrap justify-center mt-4 space-x-6 sm:space-x-10">
            {genderData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                {/* Square */}
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
