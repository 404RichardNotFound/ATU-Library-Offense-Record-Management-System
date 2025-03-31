import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useState, useRef } from 'react';
import { Tag } from 'antd';
import { Pencil, Trash2 } from 'lucide-react'; // Import icons

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

const OffenseList = () => {
  // Row Data for the Table
  const [rowData, setRowData] = useState([
    {
      Student: 'Richard Okoro',
      ID: '01222631D',
      Email: 'richard@gmail.com',
      Program: 'Computer Science',
      OffenseType: 'Late Return',
      Description: 'Did not return book on time',
      OffenseDate: date.toISOString().split('T')[0],
      Penalty: '100 GHS Fine',
      Status: 'Resolved',
    },
  ]);

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

  // Export table to CSV
  const exportToCSV = () => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv({
        processCellCallback: (params) => {
          if (params.column.getColId() === 'Actions') {
            return null;
          }
          return params.value;
        },
        columnKeys: [
          'Student',
          'ID',
          'Email',
          'Program',
          'OffenseType',
          'Description',
          'OffenseDate',
          'Penalty',
          'Status',
        ],
      });
    }
  };

  // Column Definitions
  const [colDefs] = useState<ColDef[]>([
    { field: 'Student', headerName: 'Name' },
    { field: 'ID', headerName: 'ID' },
    { field: 'Email', headerName: 'Email' },
    { field: 'Program', headerName: 'Program' },
    { field: 'OffenseType', headerName: 'Offense Type' },
    { field: 'Description', headerName: 'Description' },
    {
      field: 'OffenseDate',
      headerName: 'Offense Date',
      valueFormatter: (params) => params.value.split('T')[0],
    },
    { field: 'Penalty', headerName: 'Penalty' },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const status = params.value?.toLowerCase(); // Convert to lowercase

        // Define color mapping for different statuses
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'resolved':
              return 'green';
            case 'pending':
              return 'orange';
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
        {/* Export Button */}
        <Button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 border-[1px]"
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
          <DialogTitle>Edit Offense</DialogTitle>
          <DialogDescription>
            Modify the offense details below.
          </DialogDescription>

          <div className="flex flex-col gap-4">
            {Object.keys(editedData).map((key) => (
              <Input
                key={key}
                name={key}
                value={editedData[key] || ''}
                onChange={handleInputChange}
                placeholder={key.replace(/([A-Z])/g, ' $1').trim()} // Convert camelCase to words
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-[1px]"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 border-[1px]"
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

export default OffenseList;
