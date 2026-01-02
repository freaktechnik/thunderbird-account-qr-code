/**
 * This type encodes a subset of the allowed data for the QR code. If you need a
 * more complex structure that is supported by the format, this library is not
 * for you. All properties are required unless otherwise noted.
 *
 * @typedef {object} AccountInfo
 * @property {IncomingProtocolType} incomingProtocol - The incoming server
 *   protocol.
 * @property {string} incomingHostname - The host name of the incoming server.
 * @property {number} incomingPort - The port of the incoming server.
 * @property {ConnectionSecurity} incomingConnectionSecurity - The socket
 *   security method of the incoming server.
 * @property {AuthenticationType} incomingAuthenticationType - The
 *   authentication method of the incoming server.
 * @property {string} incomingUsername - Username to use on the incoming server.
 * @property {?string} incomingAccountName - Account name for identifying the
 *   incoming server configuration. If fully omitted, the password must also be
 *   omitted and the email address will be used as account name. A null or empty
 *   string as value still allows providing a password.
 * @property {?string} incomingPassword - If provided, the password for the
 *   incoming server. If omitted, the client will ask for the password after
 *   import.
 * @property {?"smtp"} outgoingProtocol - The outgoing protocol type. Can be
 *   omitted, since it will always be SMTP.
 * @property {string} outgoingHostname - The host name of the outgoing server.
 * @property {number} outgoingPort - The port of the outgoing server.
 * @property {ConnectionSecurity} outgoingConnectionSecurity - The socket
 *   connection security of the outgoing server.
 * @property {AuthenticationType} outgoingAuthenticationType - The
 *   authentication method of the outgoing server.
 * @property {string} outgoingUsername - The username for the outgoing server.
 * @property {?string} outgoingPassword - The password for the outgoing server.
 *   If not provided, the client will ask for a password after import.
 * @property {string} identityEmailAddress - The email address to use for
 *   outgoing messages.
 * @property {string} identityDisplayName - The name to use in outgoing
 *   messages.
 */

const FORMAT_VERSION = 1,
    OUTGOING_PROTOCOL_SMTP = 0,
    DEFAULT_SEQUENCE_POSITION = 1,
    DEFAULT_SEQUENCE_TOTAL = 1;

/**
 * @typedef {number} IncomingProtocolType
 */

/**
 * @enum {IncomingProtocolType}
 */
export const INCOMING_PROTOCOL = {
    IMAP: 0,
    POP3: 1,
};

/**
 * @typedef {number} ConnectionSecurity
 */

/**
 * @enum {ConnectionSecurity}
 */
export const CONNECTION_SECURITY = {
    Plain: 0,
    AlwaysStartTls: 2,
    Tls: 3,
};

/**
 * @typedef {number} AuthenticationType
 */

/**
 * @enum {AuthenticationType}
 */
export const AUTHENTICATION_TYPE = {
    None: 0,
    PasswordCleartext: 1,
    PasswordEncrypted: 2,
    Gssapi: 3,
    Ntlm: 4,
    TlsCertificate: 5,
    OAuth2: 6,
};

/**
 * Generate the miscellaneous data element.
 *
 * @param {number} sequenceNumber - 1-based index of the QR code.
 * @param {number} sequenceEnd - Total number of QR codes.
 * @returns {number[]}
 */
function getMiscellaneousData(sequenceNumber, sequenceEnd) {
    return [
        sequenceNumber,
        sequenceEnd,
    ];
}

/**
 * Optionally add a set of items to an array. Useful to spread into an array
 * literal.
 *
 * @param {boolean} condition - A value to check if items should be included.
 * @param {any[]} items - The items to include.
 * @returns {any[]} An empty array if the condition is false, else the items.
 */
function optionalArrayItems(condition, items) {
    if(!condition) {
        return [];
    }
    return items;
}

function isEmptyValue(value) {
    return !value && (value === null || value === "");
}

/**
 * Build the IncomingServer element.
 *
 * @param {AccountInfo} accountInfo - The account information.
 * @returns {any[]}
 */
function getIncomingServer(accountInfo) {
    return [
        accountInfo.incomingProtocol,
        accountInfo.incomingHostname,
        accountInfo.incomingPort,
        accountInfo.incomingConnectionSecurity,
        accountInfo.incomingAuthenticationType,
        accountInfo.incomingUsername,
        ...optionalArrayItems(accountInfo.incomingAccountName || isEmptyValue(accountInfo.incomingAccountName), [
            accountInfo.incomingAccountName,
            ...optionalArrayItems(accountInfo.incomingPassword, [ accountInfo.incomingPassword ]),
        ]),
    ];
}

/**
 * Build an OutgoingServer element.
 *
 * @param {AccountInfo} accountInfo - The account information.
 * @returns {any[]}
 */
function getOutgoingServer(accountInfo) {
    return [
        OUTGOING_PROTOCOL_SMTP,
        accountInfo.outgoingHostname,
        accountInfo.outgoingPort,
        accountInfo.outgoingConnectionSecurity,
        accountInfo.outgoingAuthenticationType,
        accountInfo.outgoingUsername,
        ...optionalArrayItems(accountInfo.outgoingPassword, [ accountInfo.outgoingPassword ]),
    ];
}

/**
 * Build an Identity element.
 *
 * @param {AccountInfo} accountInfo - The account information.
 * @returns {string[]}
 */
function getIdentity(accountInfo) {
    return [
        accountInfo.identityEmailAddress,
        accountInfo.identityDisplayName,
    ];
}

/**
 * Build an OutgoingServerGroups element.
 *
 * @param {AccountInfo} accountInfo - The account information.
 * @returns {any[]}
 */
function getOutgoingServerGroups(accountInfo) {
    return [ [
            getOutgoingServer(accountInfo),
            getIdentity(accountInfo),
        ] ];
}

/**
 * Get the two arrays that make up a single email account.
 *
 * @param {AccountInfo} accountInfo - The account information.
 * @returns {any[]}
 */
function getAccountArrays(accountInfo) {
    return [
        getIncomingServer(accountInfo),
        getOutgoingServerGroups(accountInfo),
    ];
}

/* eslint-disable no-secrets/no-secrets */
/**
 * This follows the specification for version 1 of the
 * {@link https://github.com/thunderbird/thunderbird-android/blob/8c2c036d36344f56128fcad77a5f355336ad67cc/feature/migration/qrcode/qr-code-format.md|Thunderbird for Andriod QR code format}.
 *
 * This generates the UTF-8 string that should then be re-encoded as binary data
 * in the QR code. Some QR code libraries support this out of the box, other
 * require explicit conversion to a byte string or more modern JS byte format
 * like UInt8Array - which can easily be achieved with a TextEncoder.
 *
 * To allow managing the QR code data size, multiple accounts can be split over
 * multiple QR codes. If you choose to do this, you must decide the split
 * yourself and then provide the sequence information in the second and third
 * function parameter.
 *
 * @param {AccountInfo[]} accountInfos
 * @param {number} [sequenceNumber=1] - The (1-based) position of this QR code
 * in a sequence of QR codes. When only transmitting a single account this can
 * be safely omitted.
 * @param {number} [sequenceTotal=1] - The total QR codes in the sequence. When
 * only transmitting a single account this can be safely omitted.
 * @returns {string}
 */
/* eslint-enable no-secrets/no-secrets */
export function encodeAccounts(
    accountInfos,
    sequenceNumber = DEFAULT_SEQUENCE_POSITION,
    sequenceTotal = DEFAULT_SEQUENCE_TOTAL,
) {
    return JSON.stringify([
        FORMAT_VERSION,
        getMiscellaneousData(sequenceNumber, sequenceTotal),
        ...accountInfos.flatMap((accountInfo) => getAccountArrays(accountInfo)),
    ]);
}
