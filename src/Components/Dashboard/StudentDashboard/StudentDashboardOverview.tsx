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
import { PieChart, Pie, Cell, Label } from 'recharts';
import judgeIcon from '../../../assets/yellow-card.png';
import paymentIcon from '../../../assets/income.png';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import { useEffect, useState } from 'react';

const StudentDashboardOverview = () => {
  const [studentOffenses, setStudentOffenses] = useState(0);
  const [studentBooks, setStudentBooks] = useState(0);
  const [studentPayments, setStudentPayments] = useState<any>(0);
  const [offenseData, setOffenseData] = useState([]);

  const studentId = sessionStorage.getItem('activeStudentId');
  const studentDataString: any = sessionStorage.getItem(`student_${studentId}`);

  useEffect(() => {
    if (!studentId) {
      console.warn('No studentId found in sessionStorage');
      return;
    }

    const studentData = JSON.parse(studentDataString);
    const studentID = studentData.ID;

    const fetchCounts = async () => {
      try {
        // 1. Fetch and count offenses
        const offensesSnap = await getDocs(
          query(
            collection(db, 'OffenseList'),
            where('Student_ID', '==', studentID)
          )
        );
        setStudentOffenses(offensesSnap.size);
        console.log('Offenses:', offensesSnap.size);

        const offenseCountsByMonth: Record<string, number> = {};

        offensesSnap.forEach((doc) => {
          const data = doc.data();
          const dateStr = data.offenseDate; // Example: "16/04/2025"

          if (dateStr) {
            const [day, month, year] = dateStr.split('/');
            const parsedDate = new Date(Date.UTC(+year, +month - 1, +day));

            console.log('Parsing offense date:', dateStr, '->', parsedDate);

            if (!isNaN(parsedDate.getTime())) {
              const monthName = parsedDate.toLocaleString('default', {
                month: 'short',
              }); // "Apr"
              offenseCountsByMonth[monthName] =
                (offenseCountsByMonth[monthName] || 0) + 1;
            } else {
              console.warn('Invalid date format:', dateStr);
            }
          }
        });

        const monthOrder = [
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

        // Generate full dataset with 0 as fallback
        const fullOffenseData: any = monthOrder.map((month) => ({
          month,
          count: offenseCountsByMonth[month] || 0,
        }));

        setOffenseData(fullOffenseData);

        // 2. Count borrowed books
        const booksSnap = await getDocs(
          query(
            collection(db, 'BorrowedBooks'),
            where('Student_ID', '==', studentID)
          )
        );
        setStudentBooks(booksSnap.size);

        // 3. Sum payments
        const paymentsSnap = await getDocs(
          query(
            collection(db, 'PaymentList'),
            where('Student_ID', '==', studentID)
          )
        );

        let totalPaid = 0;
        paymentsSnap.forEach((doc) => {
          const data = doc.data();
          totalPaid += Number(data.Amount) || 0;
        });

        setStudentPayments(totalPaid);
      } catch (error) {
        console.error('Error fetching student stats:', error);
      }
    };

    fetchCounts();
  }, []);

  const paymentTarget = 1000; // Adjust target as needed
  const pieChartData = [
    { name: 'Amount Paid', value: studentPayments },
    { name: 'Remaining', value: Math.max(0, paymentTarget - studentPayments) },
  ];

  return (
    <div className="w-full h-full bg-zinc-100">
      <div className="grid grid-cols-3 max-sm:grid-cols-1 bg-zinc-100 max-lg:grid-cols-2 gap-4 p-1 w-full">
        {/* Payment Card */}
        <div className="flex border-[1px] border-neutral-300 max-lg:w-full w-full rounded-md h-auto items-center justify-between bg-white text-black py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Payment</h1>
            <h2 className="text-lg font-bold">
              <CountUp
                start={0}
                end={studentPayments}
                duration={4}
                separator=","
                prefix="GHS "
              />
            </h2>
          </div>
          <img src={paymentIcon} className="w-11 h-11" alt="Payment Icon" />
        </div>

        {/* Borrowed Books Card */}
        <div className="flex max-lg:w-full border-neutral-300 w-full rounded-md h-auto items-center justify-between bg-white text-black py-5 px-3 border-[1px]">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Borrowed Books</h1>
            <h2 className="text-lg font-bold">
              <CountUp
                start={0}
                end={studentBooks}
                duration={4}
                separator=","
              />
            </h2>
          </div>
          <img src={bookIcon} className="w-11 h-11" alt="Book Icon" />
        </div>

        {/* Offenses Card */}
        <div className="flex border-[1px] border-neutral-300 max-lg:w-full bg-white text-black w-full rounded-md h-auto items-center justify-between py-5 px-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-md opacity-60">Offenses</h1>
            <h2 className="text-lg font-bold">
              <CountUp
                start={0}
                end={studentOffenses}
                duration={4}
                separator=","
              />
            </h2>
          </div>
          <img src={judgeIcon} className="w-12 h-12" alt="Judge Icon" />
        </div>
      </div>

      <div className="pt-4 w-full bg-zinc-100 gap-4 flex justify-between max-lg:flex-col">
        {/* Bar Chart */}
        <div className="w-full flex flex-col items-stretch p-3 py-6 border-[1px] border-neutral-300 rounded-lg bg-white">
          <h2 className="text-lg text-center mb-4">Offense Overview</h2>
          {offenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={offenseData} className="pr-3">
                <CartesianGrid strokeDasharray="3 3" className="opacity-0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3C81FF" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center mt-32 pb-28 text-sm text-gray-500">
              No offense data to display.
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap justify-center mt-4 space-x-3 sm:space-x-10">
            {[{ name: 'Offenses', color: '#3C81FF' }].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="w-1/2 max-lg:w-full p-4 border-[1px] border-neutral-300 rounded-lg bg-white">
          <div className="text-center flex flex-col items-center justify-center">
            <div className="text-lg mt-2">Total Payment</div>

            {studentPayments > 0 || paymentTarget > 0 ? (
              <PieChart width={320} height={320}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={80}
                  outerRadius={110}
                  dataKey="value"
                >
                  <Cell fill="#3C81FF" />
                  <Cell fill="#f0f0f0" />
                  <Label
                    position="center"
                    content={() => (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-bold"
                        fill="#000"
                      >
                        GHS {studentPayments.toFixed(2)}
                      </text>
                    )}
                  />
                </Pie>
              </PieChart>
            ) : (
              <div className="text-sm text-gray-500 mt-28">
                No payment data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardOverview;
