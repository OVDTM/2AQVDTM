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

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const Dashboard = () => (
    <div className="row page">
      <div className="col">
        <ContentContainer>
          <Weather />
        </ContentContainer>
        <ContentContainer>
          {/* <Levels />*/}
        </ContentContainer>
      </div>
      <div className="col">
        <ContentContainer>
          <Alerts />
        </ContentContainer>
        <ContentContainer>
          <AlertChart />
        </ContentContainer>
      </div>
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
              <ParcelCard 
                />
            </ContentContainer>
          </div>
          
          <div className="row page">
            <ContentContainer />
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