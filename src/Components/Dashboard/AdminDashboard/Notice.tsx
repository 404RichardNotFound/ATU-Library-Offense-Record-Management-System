import * as React from 'react';
import { useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react'; // Import icons
import { Empty } from 'antd'; // Ant Design Empty component
import toast, { Toaster } from 'react-hot-toast'; // Toast notifications

// Define the structure of a notice
interface Notice {
  id: number;
  notice: string;
  time: string;
}

const Notice = () => {
  // State to manage the input text for a new notice
  const [noticeText, setNoticeText] = useState<string>('');

  // State to store all notices
  const [noticeArray, setNoticeArray] = useState<Notice[]>([]);

  // Loading state to handle the submission button
  const [loading, setLoading] = useState<boolean>(false);

  // State to toggle between last 3 notices or view all
  const [showAllNotices, setShowAllNotices] = useState<boolean>(false);

  // Function to handle adding a new notice
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noticeText.trim()) return; // Prevent adding empty notices

    setLoading(true); // Show loading state

    setTimeout(() => {
      const newNotice: Notice = {
        id: noticeArray.length + 1,
        notice: noticeText,
        time: new Date().toLocaleString(), // Add current timestamp
      };

      setNoticeArray([...noticeArray, newNotice]); // Update notice list
      setNoticeText(''); // Clear input field
      setLoading(false);
      setShowAllNotices(false); // Reset view to last 3 notices

      // Show success toast
      toast.success('New notice added!', { position: 'top-center' });
    }, 500);
  };

  // Function to delete a notice
  const handleDelete = (id: number) => {
    setNoticeArray(noticeArray.filter((notice) => notice.id !== id)); // Remove notice by ID

    // Show error toast
    toast.error('Notice deleted!', { position: 'top-center' });
  };

  // Decide whether to show the last 3 notices or all
  const displayedNotices = showAllNotices ? noticeArray : noticeArray.slice(-3);

  return (
    <div className="bg-white rounded-md p-3 h-full border-2">
      {/* Toast Notification - Positioned at the Top Center */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Notice Input Section */}
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-base">Write Notice</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className="bg-zinc-100 p-2 w-full shadow-sm border-2"
            onChange={(e) => setNoticeText(e.target.value)}
            value={noticeText}
            rows={5}
            placeholder="Type a notice .."
          ></textarea>
          <button
            type="submit"
            className="mt-4 bg-blue-500 border-2 flex items-center justify-center gap-2 cursor-pointer w-32 font-semibold hover:bg-blue-600 text-white p-1.5 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Add Notice'}
          </button>
        </form>
      </div>
      {/* Separator Line */}
      <div className="p-4">
        <hr className="mt-4 border-1" />
      </div>

      {/* Notice Display Section */}
      <div>
        {/* Header with Message Icon */}
        <div className="flex gap-2 items-center">
          <MessageSquare className="text-blue-500 w-5 h-5 mt-1" />
          <h1 className="text-base">Notices</h1>
        </div>

        {/* Show Empty State if No Notices Exist */}
        {noticeArray.length === 0 ? (
          <div className="flex justify-center mt-6">
            <Empty description="No Notices Available" />
          </div>
        ) : (
          <div className="flex flex-col mt-4 justify-start gap-2">
            {displayedNotices.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-2 shadow-sm gap-3 bg-zinc-100 rounded-md p-3 w-full"
              >
                {/* Notice Content */}
                <div className="w-full overflow-hidden">
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

                {/* Delete Icon - Click to Remove Notice */}
                <Trash2
                  className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-600"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Toggle View Button - Show All / Hide Notices */}
        {noticeArray.length > 3 && (
          <div className="flex justify-center items-center mt-4">
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

export default Notice;
