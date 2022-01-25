import {
  Button,
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
import { Link } from 'react-router-dom';
import PageTitle from '../../components/Typography/PageTitle';
import response from '../../utils/demo/tableData';
import http from '../../utils/axios/axios';
import { EditIcon, TrashIcon } from '../../icons';
import { showErrorNotification } from '../../utils/notification';

function Users() {
  const [pageTable1, setPageTable1] = useState(1);
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    http
      .get('account')
      .then((r) => {
        setUsers(r.data.data.getAllUsersResult);
      })
      .catch((e) => {
        showErrorNotification(e.response.data.message || e.message);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p);
  }

  return (
    <>
      <PageTitle>Users</PageTitle>
      <div className="flex justify-end mb-4">
        <Button tag={Link} size="small" to="users/add">
          Create new user
        </Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-60">
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete">
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
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
