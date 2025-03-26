// React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
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

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const date = new Date();

const StudentsList = () => {
  // Row Data for the Table
  const [rowData, setRowData] = useState([
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
    },
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'Drexlerwrld@gmail.com',
      Program: 'Computer Science',
      Phone: '0548225869',
      Gender: 'Male',
      Joined: date.toISOString().split('T')[0],
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

    // Simulate API delay (Replace this with actual backend call later)
    setTimeout(() => {
      setRowData([...rowData]); // For now, just reloading the same data
      setIsRefreshing(false);
    }, 1500);
  };

  // Open edit modal
  const openEditModal = (row: any) => {
    setSelectedRow(row);
    setEditedData(row);
    setIsDialogOpen(true);
  };

  // Handle input changes in modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
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

  // Export table to CSV (Fixed)
  const exportToCSV = () => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv({
        processCellCallback: (params) => {
          // Exclude the "Actions" column
          if (params.column.getColId() === 'Actions') {
            return null;
          }
          if (params.column.getColId() === 'Joined') {
            const date = new Date(params.value);
            return date instanceof Date && !isNaN(date.getTime())
              ? date.toLocaleDateString('en-GB') // Format as DD/MM/YYYY
              : '';
          }
          return params.value;
        },
        columnKeys: [
          'Student',
          'ID',
          'Email',
          'Program',
          'Phone',
          'Gender',
          'Joined',
        ], // Only export these columns
      });
    }
  };

  // Column Definitions
  const [colDefs] = useState<ColDef[]>([
    { field: 'Student', headerName: 'Name' },
    { field: 'ID', headerName: 'ID' },
    { field: 'Email', headerName: 'Email' },
    { field: 'Program', headerName: 'Program' },

    {
      field: 'Phone',
      headerName: 'Phone Number',
      valueFormatter: (params) => `${params.value}`, // Forces string formatting
    },
    { field: 'Gender', headerName: 'Gender' },
    {
      field: 'Joined',
      headerName: 'Joined',
      valueFormatter: (params) => {
        if (!params.value) return ''; // Prevents errors if null
        const date = new Date(params.value);
        return date.toISOString().split('T')[0]; // Ensures "YYYY-MM-DD"
      },
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <div className="flex gap-4 h-full items-center">
          {/* Edit Icon */}
          <button
            onClick={() => openEditModal(params.data)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Pencil size={20} />
          </button>
          {/* Delete Icon */}
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
          {/* Refresh Button */}
          <Button
            onClick={refreshTable}
            className="flex items-center gap-2 hover:bg-blue-600 bg-blue-500"
          >
            {isRefreshing ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <RotateCcw size={18} />
            )}
            Refresh
          </Button>

          {/* Export Button */}
          <Button
            onClick={exportToCSV}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Export to CSV
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
          <DialogTitle>Edit Student Details</DialogTitle>
          <DialogDescription>
            Modify the student details below.
          </DialogDescription>

          <div className="flex flex-col gap-4">
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
              placeholder="ID"
            />
            <Input
              name="Email"
              value={editedData.Email || ''}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <Input
              name="Program"
              value={editedData.Program || ''}
              onChange={handleInputChange}
              placeholder="Program"
            />
            <Input
              name="Phone"
              value={editedData.Phone || ''}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <Input
              name="Gender"
              value={editedData.Gender || ''}
              onChange={handleInputChange}
              placeholder="Gender"
            />
            <Input
              name="Joined"
              value={editedData.Joined || ''}
              onChange={handleInputChange}
              placeholder="Joined"
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

export default StudentsList;
