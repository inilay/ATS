import React, { Fragment, useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { messaging } from '../../../firebase';
import MyButton from '../MyButton/MyButton';
import classes from "./PermissionButton.module.css";
import profileApi from '../../../services/api/profileApi';
import useAxios from '../../../API/useAxios';

const PermissionButton = () => {
  const api = useAxios();

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: 'BGRuxq-Gib48Mul8S-sczHAnfmzFSnruYNZedfuIDDsGDMH8cUlDJEGXumseZBxtRVw2MpH8vVpJYyvMF7yMwL8' }).then((currentToken) => {
          if (currentToken) {
            console.log('currentToken', currentToken);
            
            let data = {token: currentToken}
            profileApi.createPushToken(api, data)
          } 
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };


  return (
    <Fragment>
      {Notification.permission == "default" &&
        <div className={classes.permission_container}>
            <MyButton onClick={requestNotificationPermission}>
                Enable Push Notifications
            </MyButton>
        </div>
      }
    </Fragment>
   
  );
};

export default PermissionButton;
