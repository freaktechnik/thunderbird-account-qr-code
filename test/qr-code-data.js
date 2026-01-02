import test from "ava";
import {
    encodeAccounts,
    INCOMING_PROTOCOL,
    CONNECTION_SECURITY,
    AUTHENTICATION_TYPE,
} from "../index.js";

test("Incoming protocol constants", (t) => {
    t.deepEqual(INCOMING_PROTOCOL, {
        IMAP: 0,
        POP3: 1,
    });
});

test("Connection security constants", (t) => {
    t.deepEqual(CONNECTION_SECURITY, {
        Plain: 0,
        AlwaysStartTls: 2,
        Tls: 3,
    });
});

test("Authentication type constants", (t) => {
    t.deepEqual(AUTHENTICATION_TYPE, {
        None: 0,
        PasswordCleartext: 1,
        PasswordEncrypted: 2,
        Gssapi: 3,
        Ntlm: 4,
        TlsCertificate: 5,
        OAuth2: 6,
    });
});

test("Encode single account", (t) => {
    const encoded = encodeAccounts([ {
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
        identityDisplayName: "Test account",
    } ]);
    const parsed = JSON.parse(encoded);
    t.deepEqual(parsed, [
        1,
        [
            1,
            1,
        ],
        [
            INCOMING_PROTOCOL.IMAP,
            "imap.example.com",
            993,
            CONNECTION_SECURITY.Tls,
            AUTHENTICATION_TYPE.PasswordCleartext,
            "email@example.com",
        ],
        [ [
            [
                0,
                "smtp.example.com",
                465,
                CONNECTION_SECURITY.Tls,
                AUTHENTICATION_TYPE.PasswordCleartext,
                "email@example.com",
            ],
            [
                "email@example.com",
                "Test account",
            ],
        ] ],
    ]);
});

test("Encode multiple accounts", (t) => {
    const encoded = encodeAccounts([
        {
            incomingProtocol: INCOMING_PROTOCOL.IMAP,
            incomingHostname: "imap.example.com",
            incomingPort: 993,
            incomingConnectionSecurity: CONNECTION_SECURITY.AlwaysStartTls,
            incomingAuthenticationType: AUTHENTICATION_TYPE.PasswordEncrypted,
            incomingUsername: "emailuser",
            incomingAccountName: "test",
            incomingPassword: "hunter2",
            outgoingHostname: "smtp.example.com",
            outgoingPort: 465,
            outgoingConnectionSecurity: CONNECTION_SECURITY.Tls,
            outgoingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
            outgoingUsername: "smtpuser",
            outgoingPassword: "hunter2",
            identityEmailAddress: "other@example.com",
            identityDisplayName: "Test account",
        },
        {
            incomingProtocol: INCOMING_PROTOCOL.POP3,
            incomingHostname: "pop.example.com",
            incomingPort: 110,
            incomingConnectionSecurity: CONNECTION_SECURITY.AlwaysStartTls,
            incomingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
            incomingUsername: "email@example.com",
            incomingAccountName: null, // eslint-disable-line unicorn/no-null
            incomingPassword: "hunter2",
            outgoingHostname: "smtp.example.com",
            outgoingPort: 465,
            outgoingConnectionSecurity: CONNECTION_SECURITY.Tls,
            outgoingAuthenticationType: AUTHENTICATION_TYPE.PasswordCleartext,
            outgoingUsername: "email@example.com",
            outgoingPassword: "",
            identityEmailAddress: "email@example.com",
            identityDisplayName: "Test account 2",
        },
    ], 2, 5);
    const parsed = JSON.parse(encoded);
    t.deepEqual(parsed, [
        1,
        [
            2,
            5,
        ],
        [
            INCOMING_PROTOCOL.IMAP,
            "imap.example.com",
            993,
            CONNECTION_SECURITY.AlwaysStartTls,
            AUTHENTICATION_TYPE.PasswordEncrypted,
            "emailuser",
            "test",
            "hunter2",
        ],
        [ [
            [
                0,
                "smtp.example.com",
                465,
                CONNECTION_SECURITY.Tls,
                AUTHENTICATION_TYPE.PasswordCleartext,
                "smtpuser",
                "hunter2",
            ],
            [
                "other@example.com",
                "Test account",
            ],
        ] ],
        [
            INCOMING_PROTOCOL.POP3,
            "pop.example.com",
            110,
            CONNECTION_SECURITY.AlwaysStartTls,
            AUTHENTICATION_TYPE.PasswordCleartext,
            "email@example.com",
            null, // eslint-disable-line unicorn/no-null
            "hunter2",
        ],
        [ [
            [
                0,
                "smtp.example.com",
                465,
                CONNECTION_SECURITY.Tls,
                AUTHENTICATION_TYPE.PasswordCleartext,
                "email@example.com",
            ],
            [
                "email@example.com",
                "Test account 2",
            ],
        ] ],
    ]);
});
