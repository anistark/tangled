console.log('\033c')

const IOTA = require('iota.lib.js')
// const iota = new IOTA({provider: 'https://nodes.devnet.iota.org:443'})
const iota = new IOTA({ provider: 'https://nodes.testnet.iota.org:443' })

var messageData = {
    'coordinates': '72.0826:21.4233',
    'timestamp': '2018-12-22T11:00:00+00:00',
    'otherData': 'Asgard'
}

var rawMessage = 'Hello Jan, this is your first transaction!'

var rawMessage = JSON.stringify(messageData)

console.log('rawMessage:', rawMessage, typeof rawMessage);

const baseBundle = 'AITL9CHCUIPVBYDDWJ9BZRGGXTDQLAQGGREGZLYUPZQJL9BKDAHBLIM9GZLUYBLLVQNFWEKEQNCHXNCID'

//  Address of the IOTA coin.
var address = 'OBOYKXVCNQPJT9KLDEJOKYCACJLRFHSZHXVNXAFPNLWPCGDCUKUDH9ZJBIQYNTSL9E9WKNGTIWYUZWB9D'
// KIYVJHVSTDROUJFZJBPHHJWOYQYJGECPGC9IBKAI9GS9JJLQYSBDNHXTSLQFXRDYUGUYCTPKLDUTVHLYD
var message = iota.utils.toTrytes(rawMessage)

console.log('message 1:', message);

const transfers = [
    {
        value: 0,
        address: address,
        message: message
    }
]

const depth = 3

const minWeightMagnitude = 9

iota.api.sendTransfer(address, depth, minWeightMagnitude, transfers, (error, success) => {
    if (error) {
        console.log(error)
    } else {

        var bundle = success[0].bundle
        //  var bundle = 'ELLEKVDPPPHXHLRQTNBTJZBJZWHHVAKLCCFN9WRBTQWCCK9BWFKEOGLBIBLDIGKHNTSCNCI9GLONVUZCX'

        console.log('bundle:', success[0].bundle)

        var bundles = new Set();

        var searchVarsBundle = {
            'bundles': [bundle]
        }
        var message

        iota.api.findTransactions(searchVarsBundle, function(error, success) {
            if (error) {
                console.log(error)
            } else {
                iota.api.getBundle(success[0], function(error, success2) {
                    if (error) {
                        console.log(error)
                    } else {
                        //  console.log('success2:', success2);
                        message = success2[0].signatureMessageFragment;
                        message = message.split("9").join("");
                        console.log('message 2:', message);
                        var rawMessage = iota.utils.fromTrytes(message)
                        console.log('rawMessage:', rawMessage);
                        console.log("-----raw message-----");
                        //  console.log(success2[0].signatureMessageFragment);
                    }
                })
            }
        })
    }
})
