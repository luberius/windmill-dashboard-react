import React, { useEffect, useState } from 'react';

import {
  Button,
  HelperText,
  Input,
  Label,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from '@luberius/fork-windmill-react-ui';
import { toast } from 'react-hot-toast';
import PageTitle from '../components/Typography/PageTitle';
import http from '../utils/axios/axios';
import { formatDate, formatDateDMY } from '../utils/date';
import filterItems from '../utils/array';
import SectionTitle from '../components/Typography/SectionTitle';

function InputData() {
  const [file, setFile] = useState();
  const [historyData, setHistoryData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [historyDataTable, setHistoryDataTable] = useState([]);
  const [pageTable, setPageTable] = useState(1);

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

  const resultsPerPage = 10;

  const fetchHistory = () => {
    http
      .get('/history', {
        params: {
          start_date: startDate || new Date(),
          end_date: endDate || new Date()
        }
      })
      .then((r) => {
        setHistoryData(r.data.data.getAllDataHistory);
        setDataLength(r.data.data.getAllDataHistory.length);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data.message);
      });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const doUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const axiosCall = http.post('upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast
      .promise(axiosCall, {
        loading: 'Uploading..',
        success: 'Upload berhasil',
        error: 'Upload gagal'
      })
      .then(() => {
        setFile(undefined);
        fetchHistory();
      })
      .catch((err) => err.message);
  };

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate]);

  useEffect(() => {
    setHistoryDataTable(
      historyData.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage)
    );
  }, [pageTable, historyData]);

  return (
    <>
      <PageTitle>Input Data</PageTitle>
      <div className="flex flex-col mb-8">
        <Label>
          <span>Data File (.csv)</span>
          <Input className="mt-2 p-4" type="file" accept="text/csv" onChange={handleFileChange} />
          <HelperText>
            <b>Note:</b> Pastikan format data sesuai
          </HelperText>
        </Label>
        <div className="flex justify-end">
          <Button onClick={doUpload}>Upload</Button>
        </div>
      </div>

      <SectionTitle>History</SectionTitle>
      <TableContainer className="mt-4">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>File Name</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {historyDataTable.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">{data.filename}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.created_by}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDateDMY(new Date(data.created_at), '/')}</span>
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

export default InputData;
