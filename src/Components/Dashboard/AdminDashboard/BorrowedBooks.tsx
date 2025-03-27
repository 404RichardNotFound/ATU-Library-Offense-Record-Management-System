// React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Tag } from 'antd';
import { useState, useRef } from 'react';
import { Pencil, Trash2, RotateCcw, Loader } from 'lucide-react'; // Import icons
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { DatePicker } from 'antd'; // Import Ant Design DatePicker
import dayjs from 'dayjs'; // Import dayjs for date handling

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const date = new Date();
const BorrowedBooks = () => {
  // State to manage table row data
  const [rowData, setRowData] = useState([
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Book: 'Tell No One, Vol 1',
      BorrowDate: date.toISOString().split('T')[0],
      ReturnDate: date.toISOString().split('T')[0],
      Status: 'Borrowed',
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
      setRowData([...rowData]); // Simulating refresh
      setIsRefreshing(false);
    }, 1500);
  };

  // Open edit modal and deep clone data to avoid state mutation issues
  const openEditModal = (row: any) => {
    setSelectedRow(row);
    setEditedData({ ...row }); // Deep clone row data
    setIsDialogOpen(true);
  };

  // Handle date changes in modal
  const handleDateChange = (_date: any, dateString: string, field: string) => {
    setEditedData((prevData: any) => ({ ...prevData, [field]: dateString }));
  };

  // Save edited data
  const saveEditedData = () => {
    setRowData((prevData) =>
      prevData.map((row) =>
        row.ID === selectedRow.ID ? { ...row, ...editedData } : row
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
    { field: 'Student', headerName: 'Name' },
    { field: 'ID', headerName: 'ID' },
    { field: 'Book', headerName: 'Book Title' },
    { field: 'BorrowDate', headerName: 'Borrow Date' },
    { field: 'ReturnDate', headerName: 'Return Date' },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const status = params.value?.toLowerCase(); // Convert to lowercase

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
      <div className="ag-theme-alpine w-full h-[600px] bg-zinc-100">
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
          <DialogTitle>Edit Row</DialogTitle>
          <DialogDescription>
            Modify the student details below.
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <Input
              name="Student"
              value={editedData.Student || ''}
              onChange={(e) =>
                setEditedData({ ...editedData, Student: e.target.value })
              }
              placeholder="Student Name"
            />
            <Input name="ID" value={editedData.ID || ''} placeholder="ID" />
            <Input
              name="Book"
              value={editedData.Book || ''}
              onChange={(e) =>
                setEditedData({ ...editedData, Book: e.target.value })
              }
              placeholder="Book Title"
            />
            <DatePicker
              onChange={(date, dateString: any) =>
                handleDateChange(date, dateString, 'BorrowDate')
              }
              value={dayjs(editedData.BorrowDate)}
              placeholder="Borrow Date"
              className="w-full"
            />
            <DatePicker
              onChange={(date, dateString: any) =>
                handleDateChange(date, dateString, 'ReturnDate')
              }
              value={dayjs(editedData.ReturnDate)}
              placeholder="Return Date"
              className="w-full"
            />
            <Input
              name="Status"
              value={editedData.Status || ''}
              onChange={(e) =>
                setEditedData({ ...editedData, Status: e.target.value })
              }
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

export default BorrowedBooks;
