import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  Onfido,
  OnfidoCaptureType,
  OnfidoCountryCode,
  OnfidoDocumentType
} from '@onfido/react-native-sdk';
import { View } from 'react-native';

export type OnfidoComponentProps = {
  sdkToken: string;
  welcome: boolean;
  captureFace: boolean;
  type: string;
  docType: string;
  countryCode: string;
  onClick: any;
  response: any;
};

const OnfidoComponent = (props: OnfidoComponentProps) => {
  const { sdkToken, welcome, type, captureFace, docType, countryCode, onClick, response } = props;

  useEffect(() => {
    if (onClick) {
      authState();
    }
  }, [onClick]);

  const authState = async () => {
    Onfido.start({
      sdkToken: sdkToken,
      flowSteps: {
        welcome: welcome,
        captureFace: captureFace
          ? {
              type: OnfidoCaptureType.VIDEO
            }
          : null,
        captureDocument: {
          docType: OnfidoDocumentType.NATIONAL_IDENTITY_CARD,
          countryCode: OnfidoCountryCode.SGP
        }
      }
    })
      .then(res => {
        response(res);
        console.log('OnfidoSDK: Success:');
      })
      .catch(err => {
        response(err);
        console.warn('OnfidoSDK: Error:', err.code, err.message);
      });
  };

  return <View></View>;
};

OnfidoComponent.defaultProps = {
  welcome: true,
  captureFace: false,
  type: 'VIDEO',
  docType: 'NATIONAL_IDENTITY_CARD',
  countryCode: 'SGP'
};

export default React.memo(OnfidoComponent);
