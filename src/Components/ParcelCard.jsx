import '../css/parcelcard.css'

import EcoIcon from '../icons/svg/eco.svg'
import FlowerIcon from '../icons/svg/flower.svg'
import FlowerCircleIcon from '../icons/svg/flower_circle.svg'
import WheatIcon from '../icons/svg/wheat.svg'
import WheatFillIcon from '../icons/svg/wheat_fill.svg'

export default function ParcelCard() {
  const data = [
    { id: 1, type: 'Orge', date_semis: '2026-03-15', nom: 'Parcelle 1', localization: 'Zone A', surface: 2.45 },
    { id: 2, type: 'Tournesol', date_semis: '2026-03-20', nom: 'Parcelle 2', localization: 'Zone B', surface: 4.49 },
    { id: 3, type: 'Blé', date_semis: '2026-03-19', nom: 'Parcelle 3', localization: 'Zone C', surface: 2.15 },
    { id: 4, type: 'Maïs', date_semis: '2026-03-21', nom: 'Parcelle 4', localization: 'Zone D', surface: 2.49 },
    { id: 5, type: 'Blé', date_semis: '2026-03-16', nom: 'Parcelle 5', localization: 'Zone E', surface: 3.2 },
    { id: 6, type: 'Tournesol', date_semis: '2026-03-03', nom: 'Parcelle 6', localization: 'Zone A', surface: 4.06 },
    { id: 7, type: 'Orge', date_semis: '2026-03-19', nom: 'Parcelle 7', localization: 'Zone B', surface: 2.45 },
    { id: 8, type: 'Tournesol', date_semis: '2026-03-11', nom: 'Parcelle 8', localization: 'Zone C', surface: 3.88 },
    { id: 9, type: 'Colza', date_semis: '2026-03-12', nom: 'Parcelle 9', localization: 'Zone D', surface: 4.07 },
    { id: 10, type: 'Colza', date_semis: '2026-03-17', nom: 'Parcelle 10', localization: 'Zone E', surface: 2.37 },
  ]

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
        const zoneTheme = getZoneTheme(item.localization);
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