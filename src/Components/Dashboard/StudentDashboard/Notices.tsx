import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { MessageSquare } from 'lucide-react';
import { Empty } from 'antd';
import { db } from '../../../Firebase/firebase-config';

interface Notice {
  id: string;
  notice: string;
  time: string;
}

const Notices = () => {
  const [noticeArray, setNoticeArray] = useState<Notice[]>([]);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [loading, setLoading] = useState(true);

  const displayedNotices = showAllNotices
    ? noticeArray
    : noticeArray.slice(0, 5);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticeRef = collection(db, 'Notice');
        const snapshot = await getDocs(noticeRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Notice, 'id'>),
        }));
        setNoticeArray(data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="bg-white rounded-md p-3 h-full border-[1px]">
      {/* Notice Display Section */}
      <div>
        {/* Header with Message Icon */}
        <div className="flex gap-2 items-center">
          <MessageSquare className="text-blue-500 w-5 h-5 mt-1" />
          <h1 className="text-base">Notices</h1>
        </div>

        {/* Show Empty State if No Notices Exist */}
        {loading ? (
          <p className="mt-6 text-center text-gray-500">Loading notices...</p>
        ) : noticeArray.length === 0 ? (
          <div className="flex justify-center mt-32">
            <Empty description="No Notices Available" />
          </div>
        ) : (
          <div className="flex flex-col mt-4 justify-start gap-2">
            {displayedNotices.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-[1px] border-zinc-300 shadow-sm gap-3 bg-zinc-50 rounded-md p-3 w-full"
              >
                {/* Notice Content */}
                <div className="w-full overflow-hidden space-y-2">
                  <div className="flex h-auto gap-2">
                    <h1 className="font-bold">Message:</h1>
                    <h2 className="break-words whitespace-normal w-full">
                      {item.notice}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <h1 className="font-bold">Time:</h1>
                    <p className="text-gray-500">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toggle View Button - Show All / Hide Notices */}
        {noticeArray.length > 3 && !loading && (
          <div className="flex justify-center items-center mt-5 lg:mt-6">
            <button
              onClick={() => setShowAllNotices(!showAllNotices)}
              className="text-blue-500 hover:text-blue-600"
            >
              {showAllNotices ? 'Hide Notices' : 'View All Notices'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
