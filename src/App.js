import './App.css';

import NavRail from './Components/Navbar';
import ContentContainer from './Components/ContentContainer';

function App() {
  return (
    <div className="App">
      <NavRail />
      <div className="row">
        <div className="col">
          <ContentContainer />
          <ContentContainer />
        </div>
        <div className="col">
          <ContentContainer />
          <ContentContainer />
          <ContentContainer />
        </div>
        <div className="col">
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
