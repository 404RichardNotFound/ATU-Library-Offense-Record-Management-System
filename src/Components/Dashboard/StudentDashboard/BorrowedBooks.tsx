import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import { Tag } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import Fallback from '@/Components/FallbackUI/Fallback';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface BorrowedBook {
  id: string;
  Book_Title: string;
  Book_Author: string;
  Borrowed_Date: string;
  Return_Date: string;
  Status: string;
}

const BorrowedBooks = () => {
  const [rowData, setRowData] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);

  const [colDefs] = useState<ColDef[]>([
    { field: 'Book_Title', headerName: 'Book Title' },
    { field: 'Borrow_Date', headerName: 'Borrowed On' },
    { field: 'Return_Date', headerName: 'Return By' },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const status = params.value?.toLowerCase();

        const getStatusColor = (status: string) => {
          switch (status) {
            case 'returned':
              return 'green';
            case 'overdue':
              return 'red';
            case 'borrowed':
              return 'orange';
            default:
              return 'blue';
          }
        };

        return <Tag color={getStatusColor(status)}>{params.value}</Tag>;
      },
    },
  ]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const activeStudentId = sessionStorage.getItem('activeStudentId');
      if (!activeStudentId) {
        console.error('No activeStudentId found in sessionStorage');
        return;
      }

      const studentDataString = sessionStorage.getItem(
        `student_${activeStudentId}`
      );
      if (!studentDataString) {
        console.error('Student data not found in sessionStorage');
        return;
      }

      const studentData = JSON.parse(studentDataString);
      const studentId = studentData.ID;

      try {
        const bookRef = collection(db, 'BorrowedBooks');
        const q = query(bookRef, where('Student_ID', '==', studentId));
        const querySnapshot = await getDocs(q);

        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<BorrowedBook, 'id'>),
        }));

        setRowData(books);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 150,
  };

  return (
    <div className="ag-theme-alpine w-full h-full bg-zinc-100">
      {loading ? (
        <Fallback />
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          suppressPaginationPanel={true}
          suppressScrollOnNewData={true}
          theme="legacy"
        />
      )}
    </div>
  );
};

export default BorrowedBooks;
