import { useState } from 'react';
import { Table } from 'react-bootstrap';

import { BattleDetailsViewModal } from './BattleDetailsViewModal';

export function BattleListView({battles}) {
    const [show, setShow] = useState(false);
    const [battle, setBattle] = useState({});
  
    const showModel = (battle) => {
      setBattle(battle)
      setShow(true);
    }
  
    const handleEmptyViewData = (data, replase='---', validation=true) => (data && validation ? data : replase);
  
    return (
      <div>
        <BattleDetailsViewModal battle={battle} show={show} handleClose={() => setShow(false)}/>
  
        <Table responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Battle Name</th>
              <th>Year</th>
              <th>Attacker King</th>
              <th>Defender King</th>
              <th>Battle Type</th>
              <th>Attacker Size</th>
              <th>Defender Size</th>
              <th>Battle Result</th>
            </tr>
          </thead>
          <tbody>
              {
                battles.map((bat, index) => (
                  <tr key={bat.battle_number} onClick = {() => showModel(bat)}>
                    <td>{index}</td>
                    <td>{handleEmptyViewData(bat.name)}</td>
                    <td>{handleEmptyViewData(bat.year)}</td>
                    <td>{handleEmptyViewData(bat.attacker_king)}</td>
                    <td>{handleEmptyViewData(bat.defender_king)}</td>
                    <td>{handleEmptyViewData(bat.battle_type)}</td>
                    <td>{handleEmptyViewData(bat.attacker_size)}</td>
                    <td>{handleEmptyViewData(bat.defender_size)}</td>
                    <td>{handleEmptyViewData(`Attacker ${bat.attacker_outcome}`, 'Unknown', bat.attacker_outcome)}</td>
                  </tr>
                ))
              }
          </tbody>
        </Table>
      </div>
    )
}