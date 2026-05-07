import { useState, useEffect } from 'react';
import '../css/parcelcard.css'

import EcoIcon from '../icons/svg/eco.svg'
import FlowerIcon from '../icons/svg/flower.svg'
import FlowerCircleIcon from '../icons/svg/flower_circle.svg'
import WheatIcon from '../icons/svg/wheat.svg'
import WheatFillIcon from '../icons/svg/wheat_fill.svg'

export default function ParcelCard({ refreshKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/parcelles').then(r => r.json()),
      fetch('/api/cultures').then(r => r.json()),
    ])
      .then(([parcelles, cultures]) => {
        const merged = parcelles.map(p => {
          const culture = cultures.find(c => c.parcelle_id === p.id);
          return { ...p, type: culture?.type ?? null, date_semis: culture?.date_semis ?? null };
        });
        setData(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <p style={{ padding: '1rem' }}>Chargement des parcelles…</p>;
  if (data.length === 0) return <p style={{ padding: '1rem' }}>Aucune parcelle enregistrée.</p>;

  const getSeverityConfig = (niveau) => {
    switch (niveau) {
      case 3: return { label: 'Critique', className: 'severity-critical' };
      case 2: return { label: 'Attention', className: 'severity-warning' };
      case 1: return { label: 'Mineur', className: 'severity-info' };
      default: return { label: 'Inconnu', className: 'severity-info' };
    }
  };
  getSeverityConfig(1) // Just to prevent unused error

  const getZoneTheme = (localization) => {
    switch (localization) {
      case 'Zone A': return 'theme-a';
      case 'Zone B': return 'theme-b';
      case 'Zone C': return 'theme-c';
      case 'Zone D': return 'theme-d';
      case 'Zone E': return 'theme-e';
      default: return 'theme-a';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Blé': 
        return WheatFillIcon; 
      case 'Orge': 
        return WheatIcon;
      case 'Tournesol': 
        return FlowerIcon;
      case 'Colza': 
        return FlowerCircleIcon;
      case 'Maïs': 
        return EcoIcon;
      default: 
        return null;
    }
  };
  
  return (
    <div className="parcelcards-container">
      {data.map((item) => {
        const zoneTheme = getZoneTheme(item.localisation);
        const icon = getIcon(item.type);
        return (
          <div className="parcel-card" key={item.id}>
            <div className='row' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className='parcel-card-title'>{item.nom}</h2>
              <div className='status-case'>
                <h4 className='status-title'>OK</h4>
              </div>
            </div>
            <div className='separator' />
            <h3 className='parcel-card-subtitle'>Surface: {item.surface} Ha</h3>
            <div className='row'>
              <div className={`casing ${zoneTheme}`}>
                {icon && <img src={icon} alt={item.type} className={'parcel-card-icon'} />}
              </div>
              <div className='col'>
                <ul className='parcel-card-info'>
                  <li>Type: {item.type}</li>
                  <li>Date de semis: {item.date_semis}</li>
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}