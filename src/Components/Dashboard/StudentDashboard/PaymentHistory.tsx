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

const PaymentHistory = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [colDefs] = useState<ColDef[]>([
    { field: 'Payment_ID', headerName: 'Payment ID' },
    { field: 'Reason', headerName: 'Reason' },
    { field: 'Amount', headerName: 'Amount' },
    { field: 'Payment_Date', headerName: 'Payment Date' },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const status = params.value?.toLowerCase();

        const getColor = (status: string) => {
          switch (status) {
            case 'approved':
              return 'green';
            case 'pending':
              return 'orange';
            default:
              return 'blue';
          }
        };

        return <Tag color={getColor(status)}>{params.value}</Tag>;
      },
    },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 150,
    cellStyle: { textAlign: 'left' },
  };

  useEffect(() => {
    const fetchPaymentHistory = async () => {
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
        const paymentRef = collection(db, 'PaymentList');
        const q = query(paymentRef, where('Student_ID', '==', studentId));
        const querySnapshot = await getDocs(q);

        const payments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any), // Replace `any` with Payment type if you have one
        }));

        setRowData(payments);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);
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

export default PaymentHistory;
