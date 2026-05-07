import React, { useState } from 'react';
import './App.css';
import NavRail from './Components/Navbar';
import ContentContainer from './Components/ContentContainer';
import Weather from './Components/Weather';
import Alerts from './Components/Alerts';
import Levels from './Components/Levels';
import Informations from './Components/Informations';
import AlertChart from './Components/AlertChart';
import ParcelCard from './Components/ParcelCard';
import WeatherChart from './Components/WeatherChart';
import FabParcelles from './Components/ParcelFloatingActionButtonx';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [parcelRefreshKey, setParcelRefreshKey] = useState(0);

  const Dashboard = () => (
    <div className="dashboard-grid page">
      <ContentContainer>
        <Weather />
      </ContentContainer>
      <ContentContainer>
        <Alerts />
      </ContentContainer>
      <ContentContainer>
        <WeatherChart />
      </ContentContainer>
      <ContentContainer>
        <AlertChart />
      </ContentContainer>
    </div>
  );

  return (
    <div className="App">
      <NavRail activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      
      <div className="view-window">
        <div className="view-slider" style={{ transform: `translateY(-${activeIndex * 100}%)` }}>
          <Dashboard />
          
          <div className="row page">
            <ContentContainer>
              <ParcelCard refreshKey={parcelRefreshKey} />
              <FabParcelles onCreated={() => setParcelRefreshKey(k => k + 1)} />
            </ContentContainer>
          </div>
          
          <div className="row page">
            <ContentContainer>
              <Informations />
            </ContentContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;