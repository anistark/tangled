console.log('\033c')

const iotaCore = require('@iota/core')

const iota = iotaCore.composeAPI({provider: 'https://nodes.devnet.iota.org:443'})

iota.getNodeInfo().then(info => console.log('nodeInfo:', info)).catch(err => {})

// must be truly random & 81-trytes long
const seed = 'LEMBREDMCCKZWCCCNQXEYXTZZUDFMLZXUDUMTQSNRC9PNERKQHYV99VTXCZUB9RPEPJ9XRAINSLMMVSGH'

var messageData = {
    'coordinates': '72.0826:21.4233',
    'timestamp': '2018-12-22T11:00:00+00:00',
    'otherData': 'Asgard'
}
var rawMessage = JSON.stringify(messageData)
console.log('rawMessage:', rawMessage, typeof rawMessage);
var message = iotaCore.converter.asciiToTrytes(rawMessage)
console.log('message 1:', message);

var tagData = '999999999999999999999999999999999999999999999999999999999999999999999999999999999'
if (tagData == '999999999999999999999999999999999999999999999999999999999999999999999999999999999') {
    console.log('first one');
}
var tag = iotaCore.converter.asciiToTrytes(tagData)
console.log('tag:', tag);

// Array of transfers which defines transfer recipients and value transferred in IOTAs.
const transfers = [
    {
        address: 'UA9B9XUHRTA9RJMKMQMJSRFXPNPS9ZSNAS9EZAPLCGLEX9OEICTEVDTUJKDTXNGYWOCVAMTTPMOXKDZL9HVAKRMBFC',
        value: 0, // 1Ki
        tag: tag, // optional tag of `0-27` trytes
        message: message // optional message in trytes
    }
]

// Depth or how far to go for tip selection entry point
const depth = 3

// Difficulty of Proof-of-Work required to attach transaction to tangle.
// Minimum value on mainnet & spamnet is `14`, `9` on devnet and other testnets.
const minWeightMagnitude = 14

// Prepare a bundle and signs it
iota.prepareTransfers(seed, transfers).then(trytes => {
    // Persist trytes locally before sending to network.
    // This allows for reattachments and prevents key reuse if trytes can't
    // be recovered by querying the network after broadcasting.

    // Does tip selection, attaches to tangle by doing PoW and broadcasts.
    return iota.sendTrytes(trytes, depth, minWeightMagnitude)
}).then(bundle => {
    console.log(`Published transaction with tail hash: ${bundle[0].hash}`)
    console.log(`Bundle: ${bundle}`)
}).catch(err => {
    // catch any errors
})
