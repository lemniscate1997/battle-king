import { useState, useEffect } from 'react';

import { restURL } from './const'
import { BattleListView, BattleDetailsViewModal } from './Helpers';

import './App.css'

function App() {
  const [locations, setLocations] = useState([]);
  const [battles, setBattles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [battle, setBattle] = useState({});
  
  useEffect(() => {
    fetchLocations();
    fetchBattles();
  }, []);
  
  async function fetchLocations() {
    try {
      const result = await fetch(restURL('/list'))
      const json = await result.json();
      setLocations(json);
    } catch(e) {
      console.error(e);
    }
  }

  async function fetchBattles(loc = '') {
    try {
      let result;
      if (loc == null || loc.length === 0) {
        result = await fetch(restURL(`/search`));
      } else {
        result = await fetch(restURL(`/search?location=${loc}`));
      }
      const json = await result.json();
      setBattles(json);
    } catch(e) {
      console.error(e);
    }
  }

  const handleClick = (bat) => {
    setBattle(bat);
    setIsOpen(true);
  }

  return (
    <div className="container-fluid">
      <BattleDetailsViewModal battle={battle} open={isOpen} handleClose={()=>(setIsOpen(false))} />
      <div className="mx-3">
        {
          battles.length !== 0 && 
            <BattleListView battles={battles} handleClick={handleClick} 
              locations={locations} fetchBattles={fetchBattles} />
        }
      </div>
    </div>
  );
}

export default App;
