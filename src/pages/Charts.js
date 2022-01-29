import React, { useEffect, useState } from 'react';

import { Doughnut } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import colors from 'nice-color-palettes';
import {
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
import ChartCard from '../components/Chart/ChartCard';
import PageTitle from '../components/Typography/PageTitle';
import { doughnutOptions } from '../utils/demo/chartsData';
import http from '../utils/axios/axios';
import { formatDate } from '../utils/date';

function Charts() {
  const [stockData, setStockData] = useState([]);
  const [stockDataTable, setStockDataTable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [stockOptions, setStockOption] = useState(doughnutOptions);

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [pageTable, setPageTable] = useState(1);

  const resultsPerPage = 10;

  const fetchStockData = () => {
    http
      .get('/reportQtySum', {
        params: {
          start_date: startDate || new Date(),
          end_date: endDate || new Date(),
          branch: ''
        }
      })
      .then((r) => {
        setStockData(r.data.data.getDataStock);
        setStockDataTable(
          r.data.data.getDataStock.slice(
            (pageTable - 1) * resultsPerPage,
            pageTable * resultsPerPage
          )
        );

        generateStockData();
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const fetchBranches = () => {
    http
      .get('/branch')
      .then((r) => {
        setBranches(r.data);
      })
      .catch((e) => {
        toast.error(e.message);
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

    setStockOption({
      data: {
        datasets: [
          {
            data: theData,
            backgroundColor: bgColors,
            label: 'Dataset 1'
          }
        ],
        labels: theLables
      },
      options: {
        responsive: true,
        cutoutPercentage: 0
      },
      legend: {
        display: false
      }
    });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchStockData();
  }, [startDate, endDate]);

  useEffect(() => {
    setStockDataTable(
      stockData.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage)
    );
  }, [pageTable]);

  return (
    <>
      <PageTitle>Stock Chart</PageTitle>
      <div className="flex mb-4 md:w-1/2">
        <Label>
          <span>Start Date</span>
          <Input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </Label>
        <Label className="ml-4">
          <span>End Date</span>
          <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </Label>
      </div>
      <div className="inline-grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Doughnut">
          <Doughnut {...stockOptions} />
          <br />
        </ChartCard>

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
              totalResults={stockData.length}
              resultsPerPage={resultsPerPage}
              onChange={(p) => setPageTable(p)}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      </div>
    </>
  );
}

export default Charts;
