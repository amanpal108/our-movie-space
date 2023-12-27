import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import './Join.css';
import { CustomizedAlert } from '../';
import { db, analytics } from '../../libs';
import { useAlert } from '../../hooks';
import * as ROUTES from '../../routes';
import { ALERT_TYPE, CALL_TYPE } from '../../interfaces';
import { config } from '../../shared';
import { v4 as uuidv4 } from 'uuid';
import Typography from '@material-ui/core/Typography';

const { logoCount } = config;

const getLogoPath = (): string => {
  const index = Math.floor(Math.random() * (logoCount)) + 1;
  return `${process.env.PUBLIC_URL}/logo_${index}.jpg`;
}

export const Join = () => {
  const logo = useRef<string>(getLogoPath());
  const [name, setName] = useState<string>('');
  const [callID, setCallID] = useState<string>('');
  const { openAlert, setOpenAlert, alertMessage, alertType, fireAlert} = useAlert();
  const history = useHistory();

  const handleCreateCall = () => {
    if (name.length === 0) {
      fireAlert('Arye Name to Dalo Dumbo 🙄', ALERT_TYPE.error);
      return;
    }

    // Analytics
    const _callID = db.collection('calls').doc().id;
    const _userID = uuidv4();
    analytics.logEvent(`create_call`, {
      name,
      callID: _callID,
      _userID: _userID
    });

    // Construct location object to redirect
    const location = {
      pathname: ROUTES.ROOM,
      state: {
        name,
        callID: _callID,
        callType: CALL_TYPE.video,
        userID: _userID,
        action: 'call'
      }
    }
    history.push(location);
  }
  const handleJoinCall = () => {
    const main = async () => {
      if (name.length === 0) {
        fireAlert('Arye Name to Dalo Dumbo 🙄', ALERT_TYPE.error);
        return;
      }
      if (callID.length === 0) {
        fireAlert('Galat Call ID hai, Dhang sei Copy Paste Karo ID.', ALERT_TYPE.error);
        return;
      }

      const callDoc = db.collection('calls').doc(callID);
      const testCall = await callDoc.get();
      if (!testCall.exists) {
        fireAlert('Galat Call ID hai, Dhang sei Copy Paste Karo ID.', ALERT_TYPE.error);
        return;
      }
      
      // Analytics
      const _userID = uuidv4();
      analytics.logEvent(`join_call`, {
        name,
        callID,
        _userID: _userID
      });

      // Construct location object to redirect
      const location = {
        pathname: ROUTES.ROOM,
        state: {
          name,
          callID,
          callType: CALL_TYPE.video,
          userID: _userID,
          action: 'answer'
        }
      }
      history.push(location);
    }
    main();
  }

  return (
    <>
      <div id='joinContainer'>
        <div id='inputContainer'>

          <Typography variant="h5" gutterBottom>
          <span id='brand'>Our Movie Space</span>
          </Typography>
          <br />
          

          <TextField id='name' label='Whats your Name Darling?' variant='standard' value={name} onChange={(e) => setName(e.target.value)}/>
          <Button id='createCallBtn' variant='contained' onClick={handleCreateCall} disabled={callID.length > 0}>Create Space</Button>

          <TextField id='callID' label='Enter The Space Id'  variant='standard' value={callID} onChange={(e) => setCallID(e.target.value)}/>
          <Button id='joinCallBtn' variant='contained' color='secondary' onClick={handleJoinCall} disabled={callID.length === 0}>Join Space</Button>

        </div>
        <div id='logoContainer'>
          <img src={logo.current} alt='logo'/>
        </div>
      </div>

      <CustomizedAlert duration={5000} openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} alertType={alertType}/>
    </>
  )
}