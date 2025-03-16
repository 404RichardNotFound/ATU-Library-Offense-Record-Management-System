import bookIcon from '../../../assets/open-book.png';
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

import studentIcon from '../../../assets/people.png';
import judgeIcon from '../../../assets/punishment.png';
import programIcon from '../../../assets/learning.png';

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
const COLORS = ['#009efa', '#845ec2']; // Blue for Male, Pink for Female

const DashboardOverview = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 max-sm:grid-cols-1 bg-zinc-100 max-lg:grid-cols-2 gap-4 p-1 w-full">
        <div className="flex shadow-sm max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white py-5 px-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60 font-semibold">Total Students</h1>
            <h2 className="text-lg font-semibold">359</h2>
          </div>
          <div>
            <img src={studentIcon} className="w-12 h-12" alt="Team Icon" />
          </div>
        </div>
        <div className="flex shadow-sm max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white py-5 px-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60 font-semibold">Programs</h1>
            <h2 className="text-lg font-semibold">25</h2>
          </div>
          <div>
            <img
              src={programIcon}
              className="w-14 h-14"
              alt="Graduation Hat Icon"
            />
          </div>
        </div>
        <div className="flex shadow-sm  max-lg:w-full  w-full rounded-md h-auto items-center justify-between bg-white py-5 px-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60 font-semibold">Borrowed Books</h1>
            <h2 className="text-lg font-semibold">359</h2>
          </div>
          <div>
            <img src={bookIcon} className="w-12 h-12" alt="Book Icon" />
          </div>
        </div>
        <div className="flex shadow-sm max-lg:w-full bg-white w-full rounded-md h-auto items-center justify-between py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60 font-semibold">Offenses</h1>
            <h2 className="text-lg font-semibold">150</h2>
          </div>
          <div>
            <img src={judgeIcon} className="w-12 h-12" alt="Judge Icon" />
          </div>
        </div>
      </div>
      <div className="pt-4 w-full bg-zinc-100 gap-4 flex justify-between max-lg:flex-col">
        {/*Bar Chart*/}
        <div className="w-full p-3 py-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">
            Offense Overview
          </h2>
          <ResponsiveContainer className="-ml-5" width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="LateReturns" fill="#009efa" name="Late Returns" />
              <Bar dataKey="LostBooks" fill="#845ec2" name="Lost Books" />
              <Bar
                dataKey="NoiseViolations"
                fill="#008f7a"
                name="Noise Violations"
              />
            </BarChart>
          </ResponsiveContainer>
          {/* Custom Legend for better spacing */}
          <div className="flex flex-wrap justify-center mt-4 space-x-6 sm:space-x-10">
            {[
              { name: 'Late Returns', color: '#009efa' },
              { name: 'Lost Books', color: '#845ec2' },
              { name: 'Noise Violations', color: '#008f7a' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: item.color }}
                ></div>{' '}
                {/* Square */}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Pie Chart */}
        <div className="w-1/2 max-lg:w-full p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">
            Gender Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80} // Creates a donut effect
                outerRadius={100}
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
                ></div>{' '}
                {/* Square */}
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>Tables Will Go Here</div>
    </div>
  );
};

export default DashboardOverview;
