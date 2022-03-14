import React, { ReactNode, useContext, useEffect, useState } from "react";
import {
  Onfido,
  OnfidoCaptureType,
  OnfidoCountryCode,
  OnfidoDocumentType
} from "@onfido/react-native-sdk";
import { View } from "react-native";

export type OnfidoComponentProps = {
  sdkToken: string;
  welcome: boolean;
  captureFace: boolean;
  type: string;
  docType: string;
  countryCode: string;
  // onClick: any;
  // response: any;
};

function OnfidoComponent(props: OnfidoComponentProps) {
  const { sdkToken } = props;

  return Onfido.start({
    sdkToken: sdkToken,
    flowSteps: {
      welcome: true,
      captureDocument: {
        docType: OnfidoDocumentType.NATIONAL_IDENTITY_CARD,
        countryCode: OnfidoCountryCode.SGP
      },
      captureFace: {
        type: OnfidoCaptureType.PHOTO
      }
    }
  })
    .then(response => {
      return response;
      console.log("OnfidoSDK: Success:");
    })
    .catch(err => {
      if (err.message) {
        return "UserCanceled";
      } else {
        return err;
      }
    });
}

OnfidoComponent.defaultProps = {
  welcome: true,
  captureFace: false,
  type: "VIDEO",
  docType: "NATIONAL_IDENTITY_CARD",
  countryCode: "SGP"
};

export default OnfidoComponent;
