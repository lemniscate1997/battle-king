import { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';

import { restURL } from './const'

import { BattleListView } from './Helpers';

function App() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [battleCount, setBattleCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [battles, setBattles] = useState([]);
  
  useEffect(() => {
    fetchLocations();
    fetchBattles();
    fetchBattleCount();
  }, []);
  
  async function fetchLocations() {
    try {
      setLoading(true);
      const result = await fetch(restURL('/list'))
      const json = await result.json();
      setLocations(json);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBattleCount() {
    try {
      setLoading(true);
      const result = await fetch(restURL('/count'))
      const json = await result.json();
      setBattleCount(json.count);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBattles(loc = '') {
    try {
      setLoading(true);
      let result;
      if (loc.length === 0) {
        result = await fetch(restURL(`/search`));
      } else {
        result = await fetch(restURL(`/search?location=${loc}`));
      }
      const json = await result.json();
      setLocation(loc);
      setBattles(json);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <IsLoading isLoading={loading} />
      <div className="mx-3">
        <div className="my-3 text-left ml-2">
          {
            locations.length !== 0 &&
            <DropdownButton id="dropdown-basic-button" 
              title={location.length === 0 ? 'Location' : location} onSelect={s => fetchBattles(s)}>
                <Dropdown.Item className="text-center" key={-1} eventKey={''}>{'-- All Locations--'}</Dropdown.Item>
                {
                  locations.map((loc,index) => (<Dropdown.Item key={index} eventKey={loc}>{loc}</Dropdown.Item>))
                }
            </DropdownButton>
          }
        </div>
        {
          battles.length !== 0 && <BattleListView battles={battles} />
        }
        {
          battleCount !== 0 && 
          <div className="text-right mr-4 my-3 font-weight-bold">{`Out of ${battleCount} battles.`}</div>
        }
      </div>
    </div>
  );
}

function IsLoading ({isLoading}) {
  return (
    <div>
      {
        isLoading &&
        <div className="my-4 text-center" >
                <Spinner animation="grow" size="lg" />
        </div>
      }
    </div>
  );
}

export default App;
