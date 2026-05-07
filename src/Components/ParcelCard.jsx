import { useState, useEffect, useCallback } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import '../css/parcelcard.css'

import EcoIcon from '../icons/svg/eco.svg'
import FlowerIcon from '../icons/svg/flower.svg'
import FlowerCircleIcon from '../icons/svg/flower_circle.svg'
import WheatIcon from '../icons/svg/wheat.svg'
import WheatFillIcon from '../icons/svg/wheat_fill.svg'
import CreateParcelPopup from './Dialog';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

export default function ParcelCard({ refreshKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/parcelles').then(r => r.json()),
      fetch('/api/cultures').then(r => r.json()),
    ])
      .then(([parcelles, cultures]) => {
        setData(parcelles.map(p => {
          const c = cultures.find(c => c.parcelle_id === p.id);
          return { ...p, type: c?.type ?? null, date_semis: c?.date_semis ?? null, culture_id: c?.id ?? null };
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refetch(); }, [refreshKey, refetch]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer la parcelle "${item.nom}" ?`)) return;
    try {
      if (item.culture_id) {
        await fetch(`/api/cultures/${item.culture_id}`, { method: 'DELETE' });
      }
      const res = await fetch(`/api/parcelles/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const getZoneTheme = (localisation) => {
    switch (localisation) {
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
      case 'Blé':      return WheatFillIcon;
      case 'Orge':     return WheatIcon;
      case 'Tournesol':return FlowerIcon;
      case 'Colza':    return FlowerCircleIcon;
      case 'Maïs':     return EcoIcon;
      default:         return null;
    }
  };

  if (loading) return <p style={{ padding: '1rem' }}>Chargement des parcelles…</p>;
  if (data.length === 0) return <p style={{ padding: '1rem' }}>Aucune parcelle enregistrée.</p>;

  return (
    <>
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
              <h3 className='parcel-card-subtitle'>Surface : {item.surface} Ha</h3>
              <div className='row'>
                <div className={`casing ${zoneTheme}`}>
                  {icon && <img src={icon} alt={item.type} className='parcel-card-icon' />}
                </div>
                <div className='col'>
                  <ul className='parcel-card-info'>
                    <li>Type : {item.type ?? '—'}</li>
                    <li>Date de semis : {formatDate(item.date_semis)}</li>
                  </ul>
                </div>
              </div>
              <div className='parcel-card-actions'>
                <button
                  className='parcel-action-btn'
                  title='Modifier'
                  onClick={() => setEditItem(item)}
                >
                  <Edit fontSize='small' />
                </button>
                <button
                  className='parcel-action-btn parcel-action-btn--delete'
                  title='Supprimer'
                  onClick={() => handleDelete(item)}
                >
                  <Delete fontSize='small' />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CreateParcelPopup
        open={editItem !== null}
        handleClose={() => setEditItem(null)}
        onCreated={() => { setEditItem(null); refetch(); }}
        editData={editItem ? {
          parcelleId:   editItem.id,
          cultureId:    editItem.culture_id,
          nom:          editItem.nom,
          localisation: editItem.localisation,
          surface:      editItem.surface,
          type:         editItem.type,
          date_semis:   editItem.date_semis,
        } : null}
      />
    </>
  );
}
