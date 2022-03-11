## Overview

This SDK provides a drop-in set of screens and tools for react native applications to allow capturing of identity documents and face photos/live videos for the purpose of identity verification with [Onfido](https://onfido.com/). The SDK offers a number of benefits to help you create the best on-boarding/identity verification experience for your customers:

#### 1 iOS configuration files

Add descriptions for camera and microphone permissions to `ios/YourProjectName/Info.plist`:

```xml
<plist version="1.0">
<dict>
  <!-- Add these four elements: -->
	<key>NSCameraUsageDescription</key>
	<string>Required for document and facial capture</string>
	<key>NSMicrophoneUsageDescription</key>
	<string>Required for video capture</string>
  <!-- ... -->
</dict>
</plist>
```

Install the pods:

```bash
cd ios
pod install
cd ..
```

## Usage

```javascript
import React, { Component } from 'react';
import { Button, View } from 'react-native';
import {OnfidoComponent} from '@onfido-component';

export default class App extends Component {
  startSDK() {
    Onfido.start({
      sdkToken: 'sdkTokenFromOnfidoServer',
      flowSteps: {
        welcome: true,
        captureFace: {
          type: OnfidoCaptureType.VIDEO
        },
        captureDocument: {
          docType: OnfidoDocumentType.DRIVING_LICENCE,
          countryCode: OnfidoCountryCode.GBR
        }
      }
    })
      .then(res => console.warn('OnfidoSDK: Success:', JSON.stringify(res)))
      .catch(err => console.warn('OnfidoSDK: Error:', err.code, err.message));
  }

  render() {
    return (
			...

			<OnfidoComponent
				sdkToken={"SDKToken"}
				welcome={true}
				captureFace={false}
				type="VIDEO"
				docType="NATIONAL_IDENTITY_CARD"
				countryCode="SGP;"
				onClick={}//triger event
				response={}// respone
			/>
			...
    );
  }
}
```

### 1. Creating the SDK configuration

Once you have an added the SDK as a dependency and you have a SDK token, you can configure the SDK:

Example configuration:

```javascript
config = {
  sdkToken: “EXAMPLE-TOKEN-123”,
  flowSteps: {
    welcome: true,
    captureDocument: {
      docType: OnfidoDocumentType.DRIVING_LICENSE,
      countryCode: OnfidoCountryCode.USA
    },
    captureFace: {
      type: OnfidoCaptureType.VIDEO
    },
  },
}
```

### 2. Parameter details

- **`sdkToken`**: Required. This is the JWT sdk token obtained by making a call to the SDK token API. See section [Configuring SDK with Tokens](#3-configuring-sdk-with-tokens).
- **`flowSteps`**: Required. This object is used to toggle individual screens on and off and set configurations inside the screens.
- **`welcome`**: Optional. This toggles the welcome screen on or off. If omitted, this screen does not appear in the flow.
  - Valid values: `true`, `false`
- **`captureDocument`**: Optional. This object contains configuration for the capture document screen. If docType and countryCode are not specified, a screen will appear allowing the user to choose these values. If omitted, this screen does not appear in the flow.
- **`docType`**: Required if countryCode is specified.
  - Valid values in `OnfidoDocumentType`: `PASSPORT`, `DRIVING_LICENCE`, `NATIONAL_IDENTITY_CARD`, `RESIDENCE_PERMIT`, `RESIDENCE_PERMIT`, `VISA`, `WORK_PERMIT`, `GENERIC`.
    **Note**: `GENERIC` document type doesn't offer an optimised capture experience for a desired document type.
- **`countryCode`**: Required if docType is specified.
  - Valid values in `OnfidoCountryCode`: Any ISO 3166-1 alpha-3 code. For example: `OnfidoCountryCode.USA`.
- **`captureFace`**: Optional. This object object containing options for capture face screen. If omitted, this screen does not appear in the flow.
- **`type`**: Required if captureFace is specified.
  - Valid values in `OnfidoCaptureType`: `PHOTO`, `VIDEO`.
- **`userConsent`**: Optional. This step contains a screen to collect US end users' privacy consent for Onfido. It contains the consent language required when you offer your service to US users as well as links to Onfido's policies and terms of use. The user must click "Accept" to get past this step and continue with the flow. The content is available in English only, and is not translatable.

  - Note that this step does not automatically inform Onfido that the user has given their consent. At the end of the SDK flow, you still need to set the API parameter `privacy_notices_read_consent_given` outside of the SDK flow when [creating a check.](#creating-checks)

  - If you choose to disable this step, you must incorporate the required consent language and links to Onfido's policies and terms of use into your own application's flow before your user starts interacting with the Onfido SDK.

  - For more information about this step, and how to collect user consent, please visit [Onfido Privacy Notices and Consent](https://developers.onfido.com/guide/onfido-privacy-notices-and-consent).

- **`localisation`**: Optional. This object contains localisation configuration. See section [Localization](#localization) for the details.

  - Example usage:

  ```javascript
  config = {
    sdkToken: “EXAMPLE-TOKEN-123”,
    localisation: {
      ios_strings_file_name: 'Localizable',
    },
    flowSteps: {
      ...
    },
  }
  ```

### 3. Success Response

The response will include a `face` section if `captureFace` was specified, `document` section if `captureDocument` was specified, or both sections if thery were both requested in the config.

Example:

```javascript
{
 document: {
   front: { id: "123-abc" },
   back: { id: "345-def" }
 },
 face: {
   id: "456-567",
   variant: "VIDEO" // PHOTO or VIDEO
 },
}
```

### 4. Failure Response

The SDK will reject the promise any time the Onfido SDK exits without a success. This includes cases where:

- the configuration was invalid,
- the mobile user clicked the back button to exit the Onfido SDK.

Example

```javascript
{
  code: "config_error",
  message: "sdkToken is missing"
}
```
