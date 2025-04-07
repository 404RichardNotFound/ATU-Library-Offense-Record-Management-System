import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Tag } from 'antd';
import { db } from '../../../Firebase/firebase-config';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Fallback from '@/Components/FallbackUI/Fallback';
import { ColDef } from 'ag-grid-community';

// Register all Community features for AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Define the type of each offense object
interface Offense {
  id: string;
  OffenseType: string;
  OffenseDescription: string;
  OffenseDate: string;
  Status: string;
}

const Offenses = () => {
  const [rowData, setRowData] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);

  // Column Definitions
  const [colDefs] = useState<ColDef[]>([
    { field: 'Offense_Type', headerName: 'Offense Type' },
    { field: 'Offense_Description', headerName: 'Description' },
    {
      field: 'offenseDate',
      headerName: 'Offense Date',
      valueFormatter: (params) => {
        return params.value || 'N/A'; // Display the string directly
      },
    },
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
  ]);

  useEffect(() => {
    const fetchStudentOffenses = async () => {
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
      const studentId = studentData.ID; // The actual Student_ID to query by

      try {
        const offenseRef = collection(db, 'OffenseList');
        const q = query(offenseRef, where('Student_ID', '==', studentId));
        const querySnapshot = await getDocs(q);

        const offenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any), // Replace with your `Offense` type if defined
        }));

        setRowData(offenses);
      } catch (error) {
        console.error('Error fetching student offenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentOffenses();
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

export default Offenses;
