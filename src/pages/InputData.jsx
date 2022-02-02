import React, { useEffect, useState } from 'react';

import {
  Button,
  HelperText,
  Input,
  Label, Modal, ModalBody, ModalFooter, ModalHeader,
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
import { EditIcon, TrashIcon } from '../icons';

function InputData() {
  const [file, setFile] = useState();
  const [historyData, setHistoryData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [historyDataTable, setHistoryDataTable] = useState([]);
  const [pageTable, setPageTable] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

  const [selectedDate, setSelectedDate] = useState('');

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

  const closeModal = () => {
    setSelectedDate('');
    setIsModalOpen(false);
  };

  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
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

  const handelDelete = async () => {
    setIsLoading(true);
    const axiosCall = http.delete(`deleteImport`, {
      data: {
        date: selectedDate
      }
    });
    await toast
      .promise(axiosCall, {
        loading: 'Menghapus..',
        success: `Data pada tanggal ${selectedDate} berhasil dihapus`,
        error: 'Gagal menghapus data'
      })
      .then(() => {
        setIsLoading(false);
        closeModal();
        fetchHistory();
      })
      .catch((err) => {
        setIsLoading(false);
        return err.message;
      });
    closeModal();
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
              <TableCell>Action</TableCell>
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
                <TableCell className="w-32 lg:w-60">
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => openModal(formatDate(data.created_at))}>
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
            totalResults={dataLength}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setPageTable(p)}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Hapus Data</ModalHeader>
        <ModalBody>
          Hapus data pada tanggal <b>{selectedDate}</b>?
        </ModalBody>
        <ModalFooter className="pb-6">
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              className="bg-yellow-400 hover:bg-yellow-500"
              onClick={handelDelete}
              disabled={isLoading}>
              Hapus
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              className="bg-yellow-400 hover:bg-yellow-500"
              onClick={handelDelete}
              disabled={isLoading}>
              Hapus
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default InputData;
