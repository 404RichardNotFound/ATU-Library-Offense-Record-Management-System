import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Tag } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const BorrowedBooks = () => {
  // Row Data for the Table
  const [rowData, setRowData] = useState<{ id: string; [key: string]: any }[]>(
    []
  );

  // State for edit modal
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const borrowedBooksCollection = collection(db, 'BorrowedBooks');
        const borrowedBooksSnapshot = await getDocs(borrowedBooksCollection);
        const borrowedBooksList = borrowedBooksSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Only return the fields you want (omit the document id)

          return {
            id: doc.id, // Include the document ID
            Student: data.Student_Name || 'N/A',
            ID: data.Student_ID || 'N/A',
            Program: data.Student_Program || 'N/A',
            BookTitle: data.Book_Title || 'N/A',
            BorrowDate: data.Borrow_Date || 'N/A',
            ReturnDate: data.Return_Date || 'N/A',
            Status: data.Status || 'N/A',
          };
        });

        console.log('Final Processed Data:', borrowedBooksList); // Ensure data is mapped correctly
        setRowData(borrowedBooksList); // Set rowData without the document ID
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  // Default Column Definitions
  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 150,
    cellStyle: { textAlign: 'left' },
  };

  // Open edit modal
  const openEditModal = (row: any) => {
    setSelectedRow(row);
    setEditedData(row);
    setIsDialogOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirms delete action
  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteDoc(doc(db, 'BorrowedBooks', deleteId));
        setRowData((prev) => prev.filter((row) => row.id !== deleteId));
      } catch (error) {
        console.error('Error deleting row:', error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  // Handle input changes in modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  //Saves edited data to database
  const saveEditedData = async () => {
    if (selectedRow) {
      const borrowedBooksRef = doc(db, 'BorrowedBooks', selectedRow.id);
      try {
        await updateDoc(borrowedBooksRef, {
          Student_Name: editedData.Student,
          Student_ID: editedData.ID,
          Student_Program: editedData.Program,
          Book_Title: editedData.BookTitle,
          Borrow_Date: editedData.BorrowDate,
          Return_Date: editedData.ReturnDate,
          Status: editedData.Status,
        });
        setRowData((prev) =>
          prev.map((row) =>
            row.id === selectedRow.id ? { ...row, ...editedData } : row
          )
        );
        console.log(`Updated row with ID: ${selectedRow.id}`);
      } catch (error) {
        console.error('Error updating row:', error);
      }
    }
    setIsDialogOpen(false);
  };

  // Export table to CSV (Fixed)
  const exportToCSV = () => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv({
        processCellCallback: (params) => {
          // Exclude the "Actions" column
          if (params.column.getColId() === 'Actions') {
            return null;
          }

          // Handle the "Joined" column
          if (params.column.getColId() === 'BorrowDate') {
            // Check if the value is present, if not return 'N/A'
            return params.value || 'N/A';
          } // Handle the "Joined" column
          if (params.column.getColId() === 'ReturnDate') {
            // Check if the value is present, if not return 'N/A'
            return params.value || 'N/A';
          }

          // Return the value for other columns
          return params.value;
        },
        columnKeys: [
          'Student',
          'ID',
          'Program',
          'BookTitle',
          'BorrowDate',
          'ReturnDate',
        ], // Only export these columns
      });
    }
  };

  // Column Definitions
  const [colDefs] = useState<ColDef[]>([
    { field: 'Student', headerName: 'Name' },
    { field: 'ID', headerName: 'ID' },
    { field: 'Program', headerName: 'Program' },
    { field: 'BookTitle', headerName: 'Book Title' },
    {
      field: 'BorrowDate',
      headerName: 'Borrow Date',
      valueFormatter: (params) => {
        return params.value || 'N/A'; // Display the string directly
      },
    },
    {
      field: 'ReturnDate',
      headerName: 'Return Date',
      valueFormatter: (params) => {
        return params.value || 'N/A';
      },
    },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const status = params.value?.toLowerCase();

        // Define color mapping for different statuses
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'returned':
              return 'green';
            case 'borrowed':
              return 'blue';
            case 'overdue':
              return 'red';
            default:
              return 'blue';
          }
        };

        return <Tag color={getStatusColor(status)}>{params.value}</Tag>; // Display original text
      },
    },

    {
      field: 'Actions',
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <div className="flex gap-4 h-full items-center">
          <button
            onClick={() => openEditModal(params.data)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => openDeleteModal(params.data.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ]);

  return (
    <div className="p-0 h-full bg-zinc-100">
      {/* Header Buttons */}
      <div className="flex justify-end items-center py-1 mb-2 px-0">
        <Button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 border-[1px] transition-colors duration-300"
        >
          Export To CSV
        </Button>
      </div>
      {/* Table */}
      <div className="ag-theme-alpine w-full h-full pb-10 rounded-md bg-zinc-100">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          suppressPaginationPanel={true}
          suppressScrollOnNewData={true}
          theme="legacy"
        />
      </div>
      {/* Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] w-[90vw] rounded-sm">
          <DialogTitle>Edit Borrowed Book</DialogTitle>
          <DialogDescription>Modify the details below.</DialogDescription>
          <div className="flex flex-col gap-4">
            <Input
              name="Student"
              value={editedData.Student || ''}
              onChange={handleInputChange}
              placeholder="Student Name"
            />
            <Input
              name="ID"
              onChange={handleInputChange}
              value={editedData.ID || ''}
              placeholder="Student ID"
            />
            <Input
              name="Program"
              value={editedData.Program || ''}
              onChange={handleInputChange}
              placeholder="Program"
            />
            <Input
              name="Book"
              value={editedData.BookTitle || ''}
              onChange={handleInputChange}
              placeholder="Book Title"
            />
            <Input
              name="Borrow_Date"
              value={editedData.BorrowDate || ''}
              onChange={handleInputChange}
              placeholder="Borrow Date"
            />
            <Input
              name="Return_Date"
              value={editedData.ReturnDate || ''}
              onChange={handleInputChange}
              placeholder="Return Date"
            />
            <Input
              name="Status"
              value={editedData.Status || ''}
              onChange={handleInputChange}
              placeholder="Status"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-[1px] transition-colors duration-300"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 border-[1px] transition-colors duration-300"
              onClick={saveEditedData}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-sm:w-3/4 rounded-sm max-[360px]:w-[80%]">
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this row? This action cannot be
            undone.
          </DialogDescription>
          <div className="flex max-[400px]:flex-col justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-[1px] transition-colors duration-300"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 border-[1px] transition-colors duration-300"
              onClick={confirmDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BorrowedBooks;
