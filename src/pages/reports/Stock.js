import React, { useEffect, useState } from 'react';

import { Doughnut } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import colors from 'nice-color-palettes';
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
import ChartCard from '../../components/Chart/ChartCard';
import PageTitle from '../../components/Typography/PageTitle';
import http from '../../utils/axios/axios';
import { formatDate } from '../../utils/date';
import { defaultData, defaultOptions } from '../../models/stock.model';
import filterItems from '../../utils/array';

function Stock() {
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [stockDataTable, setStockDataTable] = useState([]);
  const [branches, setBranches] = useState([]);

  const [branch, setBranch] = useState('');
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [pageTable, setPageTable] = useState(1);
  const [searchKey, setSearchKey] = useState('');

  const [chartData, setChartData] = useState(defaultData);

  const resultsPerPage = 10;

  const fetchStockData = () => {
    http
      .get('/reportQtySum', {
        params: {
          start_date: startDate || new Date(),
          end_date: endDate || new Date(),
          branch
        }
      })
      .then((r) => {
        setStockData(r.data.data.getDataStock);
        setFilteredData(filterItems(searchKey, r.data.data.getDataStock, 'product_description'));
        setDataLength(r.data.data.getDataStock.length);
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

  const generateStockData = () => {
    const theData = [];
    const theLables = [];
    const bgColors = [];

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const index in stockData) {
      const data = stockData[index];
      theData.push(data.sum);
      theLables.push(data.product_description);
      bgColors.push(colors[index][1]);
    }

    setChartData({
      datasets: [
        {
          data: theData,
          backgroundColor: bgColors,
          label: 'Dataset 1'
        }
      ],
      labels: theLables
    });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchStockData();
  }, [branch, startDate, endDate]);

  useEffect(() => {
    generateStockData();
  }, [stockData]);

  useEffect(() => {
    setStockDataTable(
      filteredData.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage)
    );
  }, [pageTable, filteredData]);

  useEffect(async () => {
    await setPageTable(1);
    setFilteredData(filterItems(searchKey, stockData, 'product_description'));
  }, [searchKey]);

  return (
    <>
      <PageTitle>Stock Chart</PageTitle>
      <div className="inline-grid gap-6 mb-8 md:grid-cols-2">
        <div>
          <div className="flex flex-wrap mb-4">
            <Label className="flex-1">
              <span>Start Date</span>
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </Label>
            <Label className="ml-4 flex-1">
              <span>End Date</span>
              <Input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </Label>
            <Label className="mt-4 w-full">
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
          </div>
          <ChartCard title="Doughnut">
            <Doughnut data={chartData} options={defaultOptions} legend={{ display: false }} />
            <br />
          </ChartCard>
        </div>
        <div>
          <Label className="mb-6">
            <span>Search Product</span>
            <Input
              type="text"
              value={searchKey}
              onChange={(event) => setSearchKey(event.target.value)}
            />
          </Label>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Code</TableCell>
                  <TableCell>Product Desc</TableCell>
                  <TableCell>Stock</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {stockDataTable.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <span className="text-sm">{data.code}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{data.product_description}</span>
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
        </div>
      </div>
    </>
  );
}

export default Stock;
