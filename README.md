# Thunderbird account QR code
[![codecov](https://codecov.io/gh/freaktechnik/thunderbird-account-qr-code/graph/badge.svg?token=HGWPlqqIdA)](https://codecov.io/gh/freaktechnik/thunderbird-account-qr-code)

Thunderbird for Android allows [importing accounts through a QR code](https://support.mozilla.org/kb/thunderbird-android-import#w_import-the-desktop-settings-into-thunderbird-for-android). This allows easy transmission of account configuration details. The goal of this library is to help with generating such QR codes by formatting the information as required by the [format for Thunderbird for Android](https://github.com/thunderbird/thunderbird-android/blob/8c2c036d36344f56128fcad77a5f355336ad67cc/feature/migration/qrcode/qr-code-format.md).

It does, however, not include any actual QR generation capabilities, you can choose almost any library that can encode an arbitrary string as data. Note that you might have to appropriately encode the string first, so UTF-8 code points are properly transmitted.

This implementation is independent from the [one in Thunderbird desktop](https://searchfox.org/comm-central/rev/bb6559a0db8b168f98d60ec91ec5f22f041f2b14/mail/modules/QRExport.sys.mjs) and might behave differently in some cases.

## Installation

The library is published on npm, but it is also self-contained so you can also include `index.js` in your project directly. Make sure to preserve licensing information.

## Usage

To format the data, use the method `encodeAccounts` and the constants provided by the module. There is fairly thorough JS Doc explaining the usage.

### Example

```js
import {
    encodeAccounts,
    INCOMING_PROTOCOL,
    CONNECTION_SECURITY,
    AUTHENTICATION_TYPE,
} from "thunderbird-account-qr-code";
const qrInput = encodeAccounts([ {
    incomingProtocol: INCOMING_PROTOCOL.IMAP,
    incomingHostname: "imap.example.com",
    incomingPort: 993,
    incomingConnectionSecurity: CONNECTION_SECURITY.Tls,
    incomingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
    incomingUsername: "email@example.com",
    outgoingHostname: "smtp.example.com",
    outgoingPort: 465,
    outgoingConnectionSecurity: CONNECTION_SECURITY.Tls,
    outgoingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
    outgoingUsername: "email@example.com",
    identityEmailAddress: "email@example.com",
    identityDisplayName: "Example account config",
} ]);
```

## Example usage

You can find the example provided in the `example` directory hosted at https://lab.humanoids.be/thunderbird-account-qr-code/example.

## License

This library is licensed under the [MIT License](./LICENSE).
