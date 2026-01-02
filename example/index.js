import {
    encodeAccounts,
    INCOMING_PROTOCOL,
    CONNECTION_SECURITY,
    AUTHENTICATION_TYPE,
} from "../index.js";
import encodeQR from "../node_modules/qr/index.js";

const updateQR = () => {
    const input = document.getElementById("email").value,
        qrInput = encodeAccounts([ {
        incomingProtocol: INCOMING_PROTOCOL.IMAP,
        incomingHostname: "imap.example.com",
        incomingPort: 993,
        incomingConnectionSecurity: CONNECTION_SECURITY.Tls,
        incomingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
        incomingUsername: input,
        outgoingHostname: "smtp.example.com",
        outgoingPort: 465,
        outgoingConnectionSecurity: CONNECTION_SECURITY.Tls,
        outgoingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
        outgoingUsername: input,
        identityEmailAddress: input,
        identityDisplayName: "Example account config",
    } ]),
        svg = encodeQR(qrInput, "svg");
    document.getElementById("qrcode").src = `data:image/svg+xml,${svg}`;
    document.getElementById("raw").textContent = qrInput;
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("email").addEventListener("input", () => {
        updateQR();
    });
    updateQR();
}, { once: true });
