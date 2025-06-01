
import { GridRow, GridColumn } from '@/types/grid';

export const generateMockData = (rowCount: number): GridRow[] => {
  const companies = ['Apple', 'Microsoft', 'Google', 'Amazon', 'Tesla', 'Meta', 'Netflix', 'Adobe', 'Salesforce', 'Oracle'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Support'];
  const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
  
  return Array.from({ length: rowCount }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Employee ${index + 1}`,
    email: `employee${index + 1}@company.com`,
    company: companies[Math.floor(Math.random() * companies.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 150000) + 50000,
    age: Math.floor(Math.random() * 40) + 22,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    performance: Math.floor(Math.random() * 100) + 1,
    projects: Math.floor(Math.random() * 10) + 1,
    experience: Math.floor(Math.random() * 15) + 1,
    location: `City ${Math.floor(Math.random() * 50) + 1}`,
    manager: `Manager ${Math.floor(Math.random() * 20) + 1}`,
    team: `Team ${Math.floor(Math.random() * 15) + 1}`
  }));
};

export const sampleColumns: GridColumn[] = [
  { id: 'name', field: 'name', headerName: 'Name', width: 150, sortable: true, filterable: true },
  { id: 'email', field: 'email', headerName: 'Email', width: 200, sortable: true, filterable: true },
  { id: 'company', field: 'company', headerName: 'Company', width: 120, sortable: true, filterable: true },
  { id: 'department', field: 'department', headerName: 'Department', width: 120, sortable: true, filterable: true },
  { 
    id: 'salary', 
    field: 'salary', 
    headerName: 'Salary', 
    width: 100, 
    sortable: true, 
    filterable: true,
    type: 'number',
    formatter: (value) => `$${value.toLocaleString()}`
  },
  { id: 'age', field: 'age', headerName: 'Age', width: 80, sortable: true, filterable: true, type: 'number' },
  { id: 'joinDate', field: 'joinDate', headerName: 'Join Date', width: 120, sortable: true, filterable: true, type: 'date' },
  { id: 'status', field: 'status', headerName: 'Status', width: 100, sortable: true, filterable: true },
  { id: 'performance', field: 'performance', headerName: 'Performance', width: 110, sortable: true, filterable: true, type: 'number' },
  { id: 'projects', field: 'projects', headerName: 'Projects', width: 90, sortable: true, filterable: true, type: 'number' },
  { id: 'experience', field: 'experience', headerName: 'Experience', width: 110, sortable: true, filterable: true, type: 'number' },
  { id: 'location', field: 'location', headerName: 'Location', width: 120, sortable: true, filterable: true },
  { id: 'manager', field: 'manager', headerName: 'Manager', width: 130, sortable: true, filterable: true },
  { id: 'team', field: 'team', headerName: 'Team', width: 100, sortable: true, filterable: true }
];
