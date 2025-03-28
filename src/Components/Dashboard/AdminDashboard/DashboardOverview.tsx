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

// Barchart Data
const data = [
  { name: 'Mon', LateReturns: 15, LostBooks: 5, NoiseViolations: 8 },
  { name: 'Tue', LateReturns: 20, LostBooks: 7, NoiseViolations: 6 },
  { name: 'Wed', LateReturns: 18, LostBooks: 6, NoiseViolations: 10 },
  { name: 'Thurs', LateReturns: 25, LostBooks: 8, NoiseViolations: 12 },
  { name: 'Fri', LateReturns: 22, LostBooks: 5, NoiseViolations: 9 },
];

// Pie Chart Sample data
const pieData = [
  { name: 'Male', value: 60 },
  { name: 'Female', value: 40 },
];

// Define colors
const COLORS = ['#3C81FF', '#ffc75f']; // Blue for Male, Pink for Female

const DashboardOverview = () => {
  return (
    <div className="w-full h-full bg-zinc-100">
      <div className="grid grid-cols-4 max-sm:grid-cols-1 bg-zinc-100 max-lg:grid-cols-2 gap-4 p-1 w-full">
        <div className="flex text-black border-[1px] max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Total Students</h1>
            <h2 className="text-lg font-bold">
              <CountUp start={0} end={230} duration={4} separator="," />
            </h2>
          </div>
          <div>
            <img src={studentIcon} className="w-12 h-12" alt="Team Icon" />
          </div>
        </div>
        <div className="flex border-[1px] max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white text-black py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Programs</h1>
            <h2 className="text-lg font-bold">
              <CountUp start={0} end={25} duration={4} separator="," />
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
        <div className="flex max-lg:w-full  w-full rounded-md h-auto items-center justify-between bg-white text-black py-5 px-3 border-[1px]">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Borrowed Books</h1>
            <h2 className="text-lg font-bold">
              <CountUp start={0} end={67} duration={4} separator="," />
            </h2>
          </div>
          <div>
            <img src={bookIcon} className="w-11 h-11" alt="Book Icon" />
          </div>
        </div>
        <div className="flex border-[1px] max-lg:w-full bg-white text-black w-full rounded-md h-auto items-center justify-between py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Offenses</h1>
            <h2 className="text-lg font-bold">
              <CountUp start={0} end={156} duration={4} separator="," />
            </h2>
          </div>
          <div>
            <img src={judgeIcon} className="w-12 h-12" alt="Judge Icon" />
          </div>
        </div>
      </div>
      <div className="pt-4 w-full bg-zinc-100 gap-4 flex justify-between max-lg:flex-col">
        {/*Bar Chart*/}
        <div className="w-full p-3 py-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg text-center mb-4">Offense Overview</h2>
          <ResponsiveContainer className="-ml-4" width="100%" height={300}>
            <BarChart data={data} className="p-3">
              <CartesianGrid strokeDasharray="3 3" className="opacity-0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="LateReturns" fill="#3C81FF" name="Late Returns" />
              <Bar dataKey="LostBooks" fill="#ffc75f" name="Lost Books" />
              <Bar
                dataKey="NoiseViolations"
                fill="#3596b5"
                name="Noise Violations"
              />
            </BarChart>
          </ResponsiveContainer>
          {/* Custom Legend for better spacing */}
          <div className="flex flex-wrap justify-center mt-4 space-x-3 sm:space-x-10">
            {[
              { name: 'Late Returns', color: '#3C81FF' },
              { name: 'Lost Books', color: '#ffc75f' },
              { name: 'Noise Violations', color: '#3596b5' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: item.color }}
                ></div>{' '}
                {/* Square */}
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Pie Chart */}
        <div className="w-1/2 max-lg:w-full p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg text-center mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
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
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom Legend for better spacing */}
          <div className="flex flex-wrap justify-center mt-4 space-x-6 sm:space-x-10">
            {pieData.map((entry, index) => (
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
