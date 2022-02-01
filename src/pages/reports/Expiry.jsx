import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from '@luberius/fork-windmill-react-ui';
import filterItems from '../../utils/array';
import http from '../../utils/axios/axios';
import PageTitle from '../../components/Typography/PageTitle';
import { formatDateDMY } from '../../utils/date';

function Expiry() {
  const [dataExpiry, setDataExpiry] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [dataExpiryTable, setDataExpiryTable] = useState([]);
  const [branches, setBranches] = useState([]);

  const [branch, setBranch] = useState('');
  const [pageTable, setPageTable] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const resultsPerPage = 10;

  const fetchDataExpiry = () => {
    http
      .get('/reportExpiry', {
        params: {
          branch
        }
      })
      .then((r) => {
        setDataExpiry(r.data.data.getDataExpiry);
        setFilteredData(filterItems(searchKey, r.data.data.getDataExpiry, 'product_description'));
        setDataLength(r.data.data.getDataExpiry.length);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data.message);
      });
  };

  const fetchBranches = () => {
    http
      .get('/branch')
      .then((r) => {
        setBranches(r.data);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchDataExpiry();
  }, [branch]);

  useEffect(() => {
    setDataExpiryTable(
      filteredData.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage)
    );
  }, [pageTable, filteredData]);

  useEffect(async () => {
    await setPageTable(1);
    setFilteredData(filterItems(searchKey, dataExpiry, 'product_description'));
  }, [searchKey]);

  return (
    <>
      <PageTitle>Expiry report</PageTitle>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Label>
          <span>Branch</span>
          <Select onChange={(e) => setBranch(e.target.value)}>
            <option value="">All</option>
            {branches.map((b, i) => (
              <option key={i} value={b.branch}>
                {b.branch}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          <span>Search Product</span>
          <Input
            type="text"
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
          />
        </Label>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Code</TableCell>
              <TableCell>Product Desc</TableCell>
              <TableCell>Expired Date</TableCell>
              <TableCell>Stock</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataExpiryTable.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">{data.code}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.product_description}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDateDMY(new Date(data.expiry_date), '/')}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-right">{data.sum}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={dataLength}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setPageTable(p)}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Expiry;
