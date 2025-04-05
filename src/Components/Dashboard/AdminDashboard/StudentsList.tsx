import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
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

const StudentsList = () => {
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
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, 'Students');
        const studentSnapshot = await getDocs(studentsCollection);
        const studentList = studentSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Only return the fields you want (omit the document id)

          return {
            id: doc.id, // Include the document ID
            Student: data.Student_Name || 'N/A',
            ID: data.Student_ID || 'N/A',
            Email: data.Student_Email || 'N/A',
            Program: data.Student_Program || 'N/A',
            Phone: data.Student_PhoneNumber || 'N/A',
            Gender: data.Student_Gender || 'N/A',
            Joined: data.JoinDate || 'N/A',
          };
        });

        console.log('Final Processed Data:', studentList); // Ensure data is mapped correctly
        setRowData(studentList); // Set rowData without the document ID
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
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
        await deleteDoc(doc(db, 'Students', deleteId));
        setRowData((prev) => prev.filter((row) => row.id !== deleteId));
        console.log(`Deleted student with ID: ${deleteId}`);
      } catch (error) {
        console.error('Error deleting student:', error);
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
      const studentRef = doc(db, 'Students', selectedRow.id);
      try {
        await updateDoc(studentRef, {
          Student_Name: editedData.Student,
          Student_ID: editedData.ID,
          Student_Email: editedData.Email,
          Student_Program: editedData.Program,
          Student_PhoneNumber: editedData.Phone,
          Student_Gender: editedData.Gender,
          JoinDate: editedData.Joined,
        });
        setRowData((prev) =>
          prev.map((row) =>
            row.id === selectedRow.id ? { ...row, ...editedData } : row
          )
        );
        console.log(`Updated student with ID: ${selectedRow.id}`);
      } catch (error) {
        console.error('Error updating student:', error);
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
          if (params.column.getColId() === 'Joined') {
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
    {
      field: 'Gender',
      headerName: 'Gender',
      cellRenderer: (params: any) => {
        const gender = params.value?.toLowerCase(); // Convert to lowercase

        // Define color mapping for different statuses
        const getGenderColor = (gender: string) => {
          switch (gender) {
            case 'female':
              return 'orange';
            case 'male':
              return 'blue';
            default:
              return '';
          }
        };

        return <Tag color={getGenderColor(gender)}>{params.value}</Tag>; // Display original text
      },
    },

    {
      field: 'Joined',
      headerName: 'Joined',
      valueFormatter: (params) => {
        return params.value || 'N/A'; // Display the string directly
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] w-[90vw] rounded-sm">
          <DialogTitle>Edit Student</DialogTitle>
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

export default StudentsList;
