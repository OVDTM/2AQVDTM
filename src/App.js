import './App.css';

import NavRail from './Components/Navbar';
import ContentContainer from './Components/ContentContainer';
import Weather from './Components/Weather';
import Alerts from './Components/Alerts';
import Levels from './Components/Levels';

function App() {
  return (
    <div className="App">
      <NavRail />
      <div className="row">
        <div className="col">
          <ContentContainer>
            <Weather />
          </ContentContainer>
          <ContentContainer>
            <Levels />
          </ContentContainer>
        </div>
        <div className="col">
          <ContentContainer>
            <Alerts />
          </ContentContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
