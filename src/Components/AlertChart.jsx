import { BarChart } from '@mui/x-charts/BarChart';
import '../css/chart.css'
const lineData = {
  dates: ["2026-03-03", "2026-03-04", "2026-03-05", "2026-03-06", "2026-03-07", "2026-03-08", "2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13", "2026-03-14", "2026-03-15", "2026-03-16", "2026-03-17", "2026-03-18", "2026-03-19", "2026-03-20", "2026-03-21", "2026-03-22", "2026-03-23", "2026-03-24", "2026-03-25", "2026-03-26", "2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30", "2026-03-31", "2026-04-01", "2026-04-02", "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06", "2026-04-07", "2026-04-08", "2026-04-09", "2026-04-10", "2026-04-11", "2026-04-12", "2026-04-13", "2026-04-14", "2026-04-15", "2026-04-16", "2026-04-17", "2026-04-18", "2026-04-19", "2026-04-20", "2026-04-21", "2026-04-22", "2026-04-23", "2026-04-24", "2026-04-25", "2026-04-26", "2026-04-27", "2026-04-28"],
  mineur: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  attention: [0, 0, 2, 0, 0, 1, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 1, 3, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  critique: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]
};

export default function AlertChart() {  
  const filteredData = lineData.dates.reduce((acc, date, i) => {
    const hasData = lineData.mineur[i] > 0 || lineData.attention[i] > 0 || lineData.critique[i] > 0;
    if (hasData) {
      acc.dates.push(date);
      acc.mineur.push(lineData.mineur[i]);
      acc.attention.push(lineData.attention[i]);
      acc.critique.push(lineData.critique[i]);
    }
    return acc;
  }, { dates: [], mineur: [], attention: [], critique: [] });
  
  return (
    <BarChart
      height={400}
      series={[
        {
          data: filteredData.critique,
          label: 'Critique',
          stack: 'total',
          color: 'rgb(147 0 10)'
        },
        {
          data: filteredData.attention,
          label: 'Attention',
          stack: 'total',
          color: 'rgb(31 78 75)'
        },
        {
          data: filteredData.mineur,
          label: 'Mineur',
          stack: 'total',
          color: 'rgb(53 78 22)'
        },
      ]}
      xAxis={[{ 
        data: filteredData.dates,
        scaleType: 'band',
        label: 'Chronologie des erreurs',
      }]}
      yAxis={[{
        label: 'Nombre d\'alertes'
      }]}
      slotProps={{ tooltip: { trigger: 'axis' } }}
    />
  );
}