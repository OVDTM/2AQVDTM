import React, { useMemo, useState } from 'react';
import '../css/alerts.css';
import { 
  WaterDropOutlined, 
  BugReportOutlined, 
  WarningAmberOutlined 
} from '@mui/icons-material';

const rawAlerts = [
  { date: "2026-04-28", type: "Stress hydrique", parcelle: 7, niveau: 2 },
  { date: "2026-04-23", type: "Stress hydrique", parcelle: 8, niveau: 2 },
  { date: "2026-04-21", type: "Risque maladie", parcelle: 3, niveau: 3 },
  { date: "2026-04-21", type: "Risque maladie", parcelle: 9, niveau: 3 },
  { date: "2026-04-19", type: "Stress hydrique", parcelle: 9, niveau: 2 },
  { date: "2026-04-19", type: "Stress hydrique", parcelle: 6, niveau: 1 },
  { date: "2026-04-19", type: "Risque maladie", parcelle: 7, niveau: 1 },
  { date: "2026-04-18", type: "Stress hydrique", parcelle: 2, niveau: 1 },
  { date: "2026-04-17", type: "Stress hydrique", parcelle: 3, niveau: 2 },
  { date: "2026-04-15", type: "Stress hydrique", parcelle: 6, niveau: 2 },
  { date: "2026-04-14", type: "Stress hydrique", parcelle: 4, niveau: 3 },
  { date: "2026-04-14", type: "Risque maladie", parcelle: 7, niveau: 3 },
  { date: "2026-04-14", type: "Stress hydrique", parcelle: 1, niveau: 1 },
  { date: "2026-04-13", type: "Risque maladie", parcelle: 1, niveau: 1 },
  { date: "2026-04-12", type: "Stress hydrique", parcelle: 1, niveau: 2 },
  { date: "2026-04-12", type: "Stress hydrique", parcelle: 10, niveau: 2 },
  { date: "2026-04-12", type: "Risque maladie", parcelle: 2, niveau: 2 },
  { date: "2026-04-11", type: "Stress hydrique", parcelle: 3, niveau: 2 },
  { date: "2026-04-10", type: "Risque maladie", parcelle: 7, niveau: 1 },
  { date: "2026-04-09", type: "Risque maladie", parcelle: 7, niveau: 3 },
  { date: "2026-04-09", type: "Risque maladie", parcelle: 7, niveau: 2 },
  { date: "2026-04-08", type: "Risque maladie", parcelle: 10, niveau: 1 },
  { date: "2026-04-07", type: "Stress hydrique", parcelle: 10, niveau: 2 },
  { date: "2026-04-07", type: "Risque maladie", parcelle: 7, niveau: 2 },
  { date: "2026-04-02", type: "Stress hydrique", parcelle: 9, niveau: 3 },
  { date: "2026-04-02", type: "Stress hydrique", parcelle: 9, niveau: 2 },
  { date: "2026-04-02", type: "Stress hydrique", parcelle: 8, niveau: 1 }
];

const getSeverityConfig = (niveau) => {
  switch (niveau) {
    case 3: return { label: 'Critique', className: 'severity-critical' };
    case 2: return { label: 'Attention', className: 'severity-warning' };
    case 1: return { label: 'Mineur', className: 'severity-info' };
    default: return { label: 'Inconnu', className: 'severity-info' };
  }
};

const getTypeIcon = (type) => {
  if (type.includes('hydrique')) return <WaterDropOutlined />;
  if (type.includes('maladie')) return <BugReportOutlined />;
  return <WarningAmberOutlined />;
};

export default function Alerts() {
  const [filterType, setFilterType] = useState('All');

  // Smart sorting by date first and then by severity
  const sortedAlerts = useMemo(() => {
    return [...rawAlerts].sort((a, b) => {
      if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
      return b.niveau - a.niveau;
    });
  }, []);

  const filteredAlerts = sortedAlerts.filter(
    alert => filterType === 'All' || getSeverityConfig(alert.niveau).label === filterType
  );

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="alerts-card">
      <div className="alerts-header">
        <div className="row" style={{ gap: '16px', alignItems: 'center' }}>
          <h2 className="alerts-title">Alertes Détectées</h2>
          <select className='form-control' value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">Toutes</option>
            <option value="Critique">Critique</option>
            <option value="Attention">Attention</option>
          <option value="Mineur">Mineur</option>
          <option value="Inconnu">Inconnu</option>
        </select>
        </div>
        <span className="alerts-badge">{filteredAlerts.length} actives</span>
      </div>

      <div className="alerts-list">
        {filteredAlerts.map((alert, index) => {
          const severity = getSeverityConfig(alert.niveau);
          return (
            <div key={index} className="alert-item">
              <div className={`alert-icon-wrapper ${severity.className}`}>
                {getTypeIcon(alert.type)}
              </div>
              
              <div className="alert-content">
                <div className="alert-type">{alert.type}</div>
                <div className="alert-parcelle">Parcelle #{alert.parcelle}</div>
              </div>

              <div className="alert-meta">
                <span className={`severity-badge ${severity.className}`}>
                  {severity.label}
                </span>
                <span className="alert-date">{formatDate(alert.date)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}