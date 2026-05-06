import React, { useMemo, useState, useEffect } from 'react';
import '../css/alerts.css';
import {
  WaterDropOutlined,
  BugReportOutlined,
  WarningAmberOutlined
} from '@mui/icons-material';

const NIVEAU_VERS_INT = { 'faible': 1, 'moyen': 2, 'élevé': 3 };

const normaliser = (a) => ({
  date:     a.date_,
  type:     a.type,
  parcelle: a.parcelle_id,
  niveau:   NIVEAU_VERS_INT[a.niveau] ?? 1,
});

const getSeverityConfig = (niveau) => {
  switch (niveau) {
    case 3: return { label: 'Critique', className: 'severity-critical' };
    case 2: return { label: 'Attention', className: 'severity-warning' };
    case 1: return { label: 'Mineur',   className: 'severity-info' };
    default: return { label: 'Inconnu', className: 'severity-info' };
  }
};

const getTypeIcon = (type) => {
  if (type.includes('hydrique')) return <WaterDropOutlined />;
  if (type.includes('maladie'))  return <BugReportOutlined />;
  return <WarningAmberOutlined />;
};

export default function Alerts() {
  const [alertes, setAlertes]       = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetch('/api/alertes')
      .then(res => res.json())
      .then(data => {
        setAlertes((data.stockees ?? []).map(normaliser));
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  const sortedAlerts = useMemo(() => {
    return [...alertes].sort((a, b) => {
      if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
      return b.niveau - a.niveau;
    });
  }, [alertes]);

  const filteredAlerts = sortedAlerts.filter(
    alert => filterType === 'All' || getSeverityConfig(alert.niveau).label === filterType
  );

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  if (chargement) return <div className="alerts-card">Chargement...</div>;

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
