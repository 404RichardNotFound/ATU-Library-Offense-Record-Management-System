// React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Tag, DatePicker } from 'antd';
import { useState, useRef } from 'react';
import { Pencil, Trash2, RotateCcw, Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import dayjs from 'dayjs';

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const date = new Date();

const PaymentList = () => {
  // State to manage table row data
  const [rowData, setRowData] = useState([
    {
      PaymentID: 7829093,
      Student: 'Richard Okoro',
      ID: '01222631D',
      Program: 'Computer Science',
      Amount: 'GHS200.00',
      Reason: 'Lost Book',
      PaymentDate: date.toISOString().split('T')[0],
      Status: 'Paid',
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  // State for edit modal
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState<any>({});

  // Default Column Definitions
  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 150,
    cellStyle: { textAlign: 'left' },
  };

  // Refresh Table Data
  const refreshTable = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRowData([...rowData]);
      setIsRefreshing(false);
    }, 1500);
  };

  // Open edit modal
  const openEditModal = (row: any) => {
    setSelectedRow(row);
    setEditedData({ ...row });
    setIsDialogOpen(true);
  };

  // Handle input changes in modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  //Handles Date Change
  const handleDateChange = (
    _date: dayjs.Dayjs | null,
    dateString: string | string[],
    field: string
  ) => {
    if (typeof dateString === 'string') {
      setEditedData((prevData: any) => ({ ...prevData, [field]: dateString }));
    }
  };

  // Save edited data
  const saveEditedData = () => {
    setRowData((prevData) =>
      prevData.map((row) =>
        row.PaymentID === selectedRow.PaymentID
          ? { ...row, ...editedData }
          : row
      )
    );
    setIsDialogOpen(false);
  };

  // Delete row
  const deleteRow = (id: string) => {
    setRowData((prevData) => prevData.filter((row) => row.ID !== id));
  };

  // Column Definitions
  const [colDefs] = useState<ColDef[]>([
    { field: 'PaymentID', headerName: 'Payment ID' },
    { field: 'Student', headerName: 'Name' },
    { field: 'ID', headerName: 'ID' },
    { field: 'Program', headerName: 'Program' },
    { field: 'Amount', headerName: 'Amount' },
    { field: 'Reason', headerName: 'Reason' },
    {
      field: 'PaymentDate',
      headerName: 'Payment Date',
      cellRenderer: (params: any) => dayjs(params.value).format('DD/MM/YYYY'),
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
            onClick={() => deleteRow(params.data.ID)}
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
        <div className="flex gap-4">
          <Button
            onClick={refreshTable}
            className="flex items-center gap-2 hover:bg-blue-600 bg-blue-500"
          >
            {isRefreshing ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <RotateCcw size={18} />
            )}{' '}
            Refresh
          </Button>
          <Button
            onClick={() => gridRef.current?.api.exportDataAsCsv()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Export To CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="ag-theme-alpine w-full h-full pb-9 bg-zinc-100">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={13}
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
              value={editedData.PaymentID || ''}
              disabled
              placeholder="Payment ID"
              className="bg-gray-100 cursor-not-allowed"
            />
            <Input
              name="Student"
              value={editedData.Student || ''}
              onChange={handleInputChange}
              placeholder="Student Name"
            />
            <Input
              name="ID"
              value={editedData.ID || ''}
              onChange={handleInputChange}
              placeholder="Student ID"
            />
            <Input
              name="Program"
              value={editedData.Program || ''}
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
            <DatePicker
              onChange={(date, dateString) =>
                handleDateChange(date, dateString, 'PaymentDate')
              }
              value={
                editedData.PaymentDate ? dayjs(editedData.PaymentDate) : null
              }
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={saveEditedData}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentList;
