import React from 'react';
import { Modal, Card } from 'react-bootstrap';

import './BattleDetailsViewModel.css';

export function BattleDetailsViewModal({battle, show, handleClose}) {
    const getAttackers = (prefix) => (
        [battle[`${prefix}_1`], battle[`${prefix}_2`], battle[`${prefix}_3`], battle[`${prefix}_4`]].filter(x => x).join(', ')
    );
  
    const getBGColotClass = (unKnown, result) => ( unKnown ? 'unknown' : result ? 'win' : 'loss');

    const getAttackerOrDefenderData = (prefix, result, unKnown) => (
      <Card className={`max-hight-card ${getBGColotClass(unKnown, result)}`} body>
        <h5 className="text-center font-weight-bold">
          {battle[`${prefix}_king`] ? battle[`${prefix}_king`] : prefix.toUpperCase()}
        </h5>
        <div className="mt-4">
          <span className="font-weight-bold">{`Commander: `}</span>{battle[`${prefix}_commander`]}
        </div>
        <div className="mt-2">
          <span className="font-weight-bold">{`Attckers: `}</span>{getAttackers(prefix)}
        </div>
        <div className="mt-2">
          <span className="font-weight-bold">{`Total attckers: `}</span>{battle[`${prefix}_size`] ? battle[`${prefix}_size`] : '---'}
        </div>
      </Card>
    );
  
    return (
      <Modal
        show={show} onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="modal-header">
        </Modal.Header>
        <Modal.Body>
          <h3 className="text-center mb-5">{battle.name}</h3>
          <div className="row mx-3">
            <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
              {getAttackerOrDefenderData('attacker', battle.attacker_outcome === 'win', !battle.attacker_outcome)
            }</div>
            <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12  text-center my-auto font-weight-bold">V/S</div>
            <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
              {getAttackerOrDefenderData('defender', battle.attacker_outcome !== 'win', !battle.attacker_outcome)}
            </div>
          </div>
          <div className="text-center font-weight-bold mt-4">{`Number of death are ${battle.major_death ? battle.major_death : 'unknown'}`}</div>
          <h5 className="text-center mt-3 mb-4">
            {
              battle.attacker_outcome === 'win'? `${battle.attacker_king} won the battle` 
                : battle.attacker_outcome === 'loss'? `${battle.defender_king} won the battle` : 'Result Unknown'
            }
          </h5>
        </Modal.Body>
      </Modal>
    );
}
  