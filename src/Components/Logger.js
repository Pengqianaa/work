import React from 'react';
import { useLastLocation } from 'react-router-last-location';
import Api from '../Common/api'
import { store } from '../store'
import { Actions } from '../Common/constants' 
const Logger = props => {
  const lastLocation = useLastLocation();

    // Intercept Render and dynamically add logging Actvities
    let fullUrl = encodeURIComponent(window.location.origin + window.location.pathname);
    let queryString = window.location.search;
    let refererPage = null;
    if(store.getState().view.isLogPage){
    // See whether there is a last Route
    if(lastLocation === null || lastLocation === undefined){
        refererPage = encodeURIComponent(document.referrer);
        // console.log(`lastLocation is null or undefined , refererPage=${refererPage}`);
    }
    else {
        refererPage = encodeURIComponent(window.location.origin + lastLocation.pathname);
        // console.log(`lastLocation is there , refererPage=${refererPage}`);
    }    
    // console.log(`typeof refererPage=${typeof refererPage}`);
      if(!queryString){
         Api.doLogTransitionOfRoute({ fullUrl, queryString, refererPage });
      }
    }
    store.dispatch({ type: Actions.SET_ISLOGPAGE, payload:true})

  return (
    <div style={{display:'none'}}>
      <h2>Logger!</h2>
      <pre>
        {JSON.stringify(lastLocation)}
      </pre>
    </div>
  );
};
 
export default Logger;