import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useState, useRef, useEffect } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
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

const OffenseList = () => {
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
    const fetchOffense = async () => {
      try {
        const offenseCollection = collection(db, 'OffenseList');
        const offenseSnapshot = await getDocs(offenseCollection);
        const offenseList = offenseSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Only return the fields you want (omit the document id)

          return {
            id: doc.id, // Include the document ID
            Student: data.Student_Name || 'N/A',
            ID: data.Student_ID || 'N/A',
            Email: data.Student_Email || 'N/A',
            Program: data.Student_Program || 'N/A',
            OffenseType: data.Offense_Type || 'N/A',
            OffenseDescription: data.Offense_Description || 'N/A',
            OffenseDate: data.offenseDate || 'N/A',
            Penalty: data.Penalty || 'N/A',
            Status: data.Status || 'N/A',
          };
        });

        console.log('Final Processed Data:', offenseList); // Ensure data is mapped correctly
        setRowData(offenseList); // Set rowData without the document ID
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchOffense();
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
        await deleteDoc(doc(db, 'OffenseList', deleteId));
        setRowData((prev) => prev.filter((row) => row.id !== deleteId));
        console.log(`Deleted offense with ID: ${deleteId}`);
      } catch (error) {
        console.error('Error deleting offense:', error);
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
      const offenseRef = doc(db, 'OffenseList', selectedRow.id);
      try {
        await updateDoc(offenseRef, {
          Student_Name: editedData.Student,
          Student_ID: editedData.ID,
          Student_Email: editedData.Email,
          Student_Program: editedData.Program,
          Offense_Type: editedData.OffenseType,
          Offense_Description: editedData.OffenseDescription,
          offenseDate: editedData.OffenseDate,
          Penalty: editedData.Penalty,
          Status: editedData.Status,
        });
        setRowData((prev) =>
          prev.map((row) =>
            row.id === selectedRow.id ? { ...row, ...editedData } : row
          )
        );
        console.log(`Updated offense with ID: ${selectedRow.id}`);
      } catch (error) {
        console.error('Error updating offense:', error);
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
          if (params.column.getColId() === 'OffenseDate') {
            // Check if the value is present, if not return 'N/A'
            return params.value || 'N/A';
          }

          // Return the value for other columns
          return params.value;
        },
        columnKeys: [
          'Student',
          'ID',
          'Email',
          'Program',
          'OffenseType',
          'OffenseDescription',
          'OffenseDate',
          'Penalty',
          'Status',
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
    { field: 'OffenseType', headerName: 'Offense Type' },
    { field: 'OffenseDescription', headerName: 'Description' },
    {
      field: 'OffenseDate',
      headerName: 'Offense Date',
      valueFormatter: (params) => {
        return params.value || 'N/A'; // Display the string directly
      },
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
        {/* Export Button */}
        <Button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] w-[90vw] rounded-sm">
          <DialogTitle>Edit Offense</DialogTitle>
          <DialogDescription>
            Modify the offense details below.
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
              name="OffenseType"
              value={editedData.OffenseType || ''}
              onChange={handleInputChange}
              placeholder="Offense Type"
            />
            <Input
              name="OffenseDescription"
              value={editedData.OffenseDescription || ''}
              onChange={handleInputChange}
              placeholder="Offense Description"
            />
            <Input
              name="OffenseDate"
              value={editedData.OffenseDate || ''}
              onChange={handleInputChange}
              placeholder="Offense Date"
            />
            <Input
              name="Penalty"
              value={editedData.Penalty || ''}
              onChange={handleInputChange}
              placeholder="Penalty"
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

export default OffenseList;
