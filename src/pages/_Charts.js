import React, { useEffect, useState } from 'react';

import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import colors from 'nice-color-palettes';
import { HelperText, Input, Label } from '@luberius/fork-windmill-react-ui';
import ChartCard from '../components/Chart/ChartCard';
import ChartLegend from '../components/Chart/ChartLegend';
import PageTitle from '../components/Typography/PageTitle';
import {
  doughnutOptions,
  lineOptions,
  barOptions,
  doughnutLegends,
  lineLegends,
  barLegends
} from '../utils/demo/chartsData';
import http from '../utils/axios/axios';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '../utils/date';

function Charts() {
  const [stockData, setStockData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [stockOptions, setStockOption] = useState(doughnutOptions);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Doughnut">
          <Doughnut {...stockOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>

        <ChartCard title="Lines">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Bars">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
      </div>
    </>
  );
}

export default Charts;
