import './App.css';

import NavRail from './Components/Navbar';
import ContentContainer from './Components/ContentContainer';
import Weather from './Components/Weather';

function App() {
  return (
    <div className="App">
      <NavRail />
      <div className="row">
        <div className="col">
          <ContentContainer>
            <Weather />
          </ContentContainer>
          <ContentContainer />
        </div>
        <div className="col">
          <ContentContainer />
          <ContentContainer />
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
