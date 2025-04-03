// React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
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

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const PaymentList = () => {
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

  // Default Column Definitions
  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 150,
    cellStyle: { textAlign: 'left' },
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'PaymentList'));
        const payments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRowData(payments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

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
        await deleteDoc(doc(db, 'PaymentList', deleteId));
        setRowData((prev) => prev.filter((row) => row.id !== deleteId));
      } catch (error) {
        console.error('Error deleting payment:', error);
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
      const paymentRef = doc(db, 'PaymentList', selectedRow.id);
      try {
        await updateDoc(paymentRef, {
          Payment_ID: editedData.Payment_ID,
          Student_Name: editedData.Student_Name,
          Student_ID: editedData.Student_ID,
          Student_Program: editedData.Student_Program,
          Amount: editedData.Amount,
          Reason: editedData.Reason,
          Status: editedData.Status,
          Payment_Date: editedData.Payment_Date,
        });
        setRowData((prev) =>
          prev.map((row) =>
            row.id === selectedRow.id ? { ...row, ...editedData } : row
          )
        );
        console.log(`Updated payment with ID: ${selectedRow.id}`);
      } catch (error) {
        console.error('Error updating payment:', error);
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
          if (params.column.getColId() === 'Payment_Date') {
            // Check if the value is present, if not return 'N/A'
            return params.value || 'N/A';
          }

          // Return the value for other columns
          return params.value;
        },
        columnKeys: [
          'Payment_ID',
          'Student_Name',
          'Student_ID',
          'Studuent_Program',
          'Amount',
          'Reason',
          'Payment_Date',
          'Status',
        ], // Only export these columns
      });
    }
  };
  // Column Definitions
  const [colDefs] = useState<ColDef[]>([
    { field: 'Payment_ID', headerName: 'Payment ID' },
    { field: 'Student_Name', headerName: 'Name' },
    { field: 'Student_ID', headerName: 'ID' },
    { field: 'Student_Program', headerName: 'Program' },
    { field: 'Amount', headerName: 'Amount' },
    { field: 'Reason', headerName: 'Reason' },
    {
      field: 'Payment_Date',
      headerName: 'Payment Date',
      valueFormatter: (params) => {
        return params.value || 'N/A'; // Display the string directly
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
            case 'paid':
              return 'green';
            case 'not paid':
              return 'red';
            default:
              return 'blue';
          }
        };

        return <Tag color={getStatusColor(status)}>{params.value}</Tag>;
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
      <div className="ag-theme-alpine w-full h-full pb-10 bg-zinc-100">
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
        <DialogContent className="max-sm:w-3/4 rounded-sm">
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Modify the payment details below.
          </DialogDescription>

          <div className="flex flex-col gap-4">
            <Input
              name="PaymentID"
              value={editedData.Payment_ID || ''}
              disabled
              placeholder="Payment ID"
              className="bg-gray-100 cursor-not-allowed"
            />
            <Input
              name="Student"
              value={editedData.Student_Name || ''}
              onChange={handleInputChange}
              placeholder="Student Name"
            />
            <Input
              name="ID"
              value={editedData.Student_ID || ''}
              onChange={handleInputChange}
              placeholder="Student ID"
            />
            <Input
              name="Program"
              value={editedData.Student_Program || ''}
              onChange={handleInputChange}
              placeholder="Program"
            />
            <Input
              name="Amount"
              value={editedData.Amount || ''}
              onChange={handleInputChange}
              placeholder="Amount"
            />
            <Input
              name="Reason"
              value={editedData.Reason || ''}
              onChange={handleInputChange}
              placeholder="Reason"
            />
            <Input
              value={editedData.Payment_Date || ''}
              onChange={handleInputChange}
              placeholder="Payment Date"
              className="w-full"
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
              className="bg-blue-500 border-[1px] hover:bg-blue-600 transition-colors duration-300"
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
            Are you sure you want to delete this student? This action cannot be
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

export default PaymentList;
