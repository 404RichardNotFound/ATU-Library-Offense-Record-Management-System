import * as React from 'react';
import { useState, useEffect } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Empty } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/Components/ui/dialog';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';

// Define the structure of a notice
interface Notice {
  id: string;
  notice: string;
  time: string;
}

const Notice = () => {
  const [noticeText, setNoticeText] = useState<string>('');
  const [noticeArray, setNoticeArray] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAllNotices, setShowAllNotices] = useState<boolean>(true);

  // State to control the confirmation modal visibility
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // State to control the delete confirmation modal visibility
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);

  // Fetch notices from Firestore
  useEffect(() => {
    const q = query(collection(db, 'Notice'), orderBy('time', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notices: Notice[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id, // Firestore document ID
          notice: data.notice, // The notice message
          time: data.time, // Time is already a string, so no conversion is needed
        };
      });

      console.log('Notices:', notices); // Log the fetched notices
      setNoticeArray(notices); // Update state with the fetched notices
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noticeText.trim()) return;

    setLoading(true);

    try {
      // Add new notice to Firestore
      await addDoc(collection(db, 'Notice'), {
        notice: noticeText,
        time: new Date().toLocaleString(),
      });
      setNoticeText('');
      setShowAllNotices(false);
      toast.success('New notice added!');
    } catch (error) {
      console.error('Error adding notice:', error);
      toast.error('Failed to add notice.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (noticeToDelete) {
      try {
        await deleteDoc(doc(db, 'Notice', noticeToDelete));
        toast.success('Notice deleted!');
        setNoticeToDelete(null); // Clear the notice to delete
      } catch (error) {
        console.error('Error deleting notice:', error);
        toast.error('Failed to delete notice.');
      }
    }
    setIsModalVisible(false); // Close modal after deletion
  };

  const showDeleteConfirm = (id: string) => {
    setNoticeToDelete(id);
    setIsModalVisible(true); // Show the confirmation modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close modal without deleting
    setNoticeToDelete(null); // Clear the notice to delete
  };

  const displayedNotices = showAllNotices
    ? noticeArray
    : noticeArray.slice(0, 3);

  return (
    <div className="bg-white rounded-md p-3 h-full border-[1px]">
      {/* Toast Notification - Positioned at the Top Center */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Notice Input Section */}
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-base">Write Notice</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className="bg-zinc-100 p-2 w-full shadow-sm border-[1px] hover:border-dotted"
            onChange={(e) => setNoticeText(e.target.value)}
            value={noticeText}
            rows={5}
            placeholder="Type a notice .."
          ></textarea>
          {/* Submit Button with Loading Spinner */}
          <div className="flex gap-2 mt-1 justify-start">
            <button
              type="submit"
              className="border-2 transition-colors duration-300 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
              disabled={loading} // Disable button while submitting
            >
              {/* Show spinner when submitting */}
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {/* Change button text when submitting */}
              {loading ? 'Please wait...' : 'Add Notice'}
            </button>
          </div>
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

                {/* Delete Icon - Click to Remove Notice */}
                <Trash2
                  className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-600"
                  onClick={() => showDeleteConfirm(item.id)}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="max-sm:w-3/4 rounded-sm max-[360px]:w-[80%]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notice?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex max-[400px]:flex-col justify-end gap-2 mt-4">
            <DialogClose
              onClick={handleCancel}
              className="border-[1px] border-zinc-300 shadow-sm transition-colors duration-300 px-3 py-2 rounded-md hover:bg-zinc-100"
            >
              Cancel
            </DialogClose>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 border-[1px] transition-colors duration-300"
            >
              Confirm Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notice;
