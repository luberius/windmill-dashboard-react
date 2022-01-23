import {
  Avatar,
  Badge,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from '@luberius/fork-windmill-react-ui';
import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import response from '../utils/demo/tableData';

function Users() {
  const [dataTable1, setDataTable1] = useState([]);
  const [pageTable1, setPageTable1] = useState(1);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p);
  }

  useEffect(() => {
    setDataTable1(response.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage));
  }, [pageTable1]);

  return (
    <>
      <PageTitle>Users</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.job}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {user.amount}</span>
                </TableCell>
                <TableCell>
                  <Badge type={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(user.date).toLocaleDateString()}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable1}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Users;
