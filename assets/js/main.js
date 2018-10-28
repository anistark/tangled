var iota = new IOTA({'provider': 'https://nodes.testnet.iota.org:443'})

function getIpData(cb) {
    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
        cb(JSON.stringify(data, null, 2));
    });
}

function getBundleData(bundles, cb) {
    console.log('bundles count:', bundles.length);
    let bundlesData = []
    for (var i = 0; i < bundles.length; i++) {
        iota.api.getBundle(bundles[i], function(error, success2) {
            if (error) {
                console.log('error:', error)
            } else {
                console.log('success2:', success2);
                message = success2[0].signatureMessageFragment
                message = message.split("9").join("")
                $('#message-trytes').html('Message Trytes: '+message)
                var rawMessage = iota.utils.fromTrytes(message)
                bundlesData.push(JSON.parse(rawMessage))
                if(bundles.length == bundlesData.length) {
                    cb(bundlesData)
                }
            }
        })
    }
}

$('#push-to-tangle').click(function() {
    console.log('-- pushing to tangle --', 'seed:', $('#seed').val(), '| comment:', $('#comment').val());
    var messageData = {
        'timestamp': moment().format(),
        'comment': $('#comment').val()
    }
    getIpData(function (co) {
        co = JSON.parse(co)
        messageData['coordinate'] = co.geobyteslongitude+' '+co.geobyteslatitude
        // messageData['otherData'] = {
        //     'city': co.geobytescity,
        //     'country': co.geobytescountry,
        //     'region': co.geobytesregion,
        //     'ip': co.geobytesipaddress
        // }
        console.log('messageData:', messageData);
        var rawMessage = JSON.stringify(messageData);
        var message = iota.utils.toTrytes(rawMessage);
        // Tag
        // let tag = $('#address').val()
        // console.log('tag:', tag);
        var transfers = [
            {
                value: 0,
                address: $('#address').val(),
                message: message
            }
        ]
        const depth = 3
        const minWeightMagnitude = 9
        iota.api.sendTransfer($('#seed').val(), depth, minWeightMagnitude, transfers, (error, success) => {
            if (error) {
                console.log(error)
            } else {
                $('#latest-bundle').html(success[0].bundle)
            }
        });
    })
})

$('#fetch-from-tangle').click(function () {
    console.log('-- fetching from tangle --', 'bundle-hash:', $('#retreive-address').val());
    var searchVarsBundle = {
        // 'bundles': [bundle]
        'addresses': [$('#retreive-address').val()]
    }
    var message = ''
    iota.api.findTransactions(searchVarsBundle, function(error, success) {
        if (error) {
            console.log('error:', error)
        } else {
            // console.log('success:', success);
            getBundleData(success, function (tangleData) {
                $('#tangle-data').html('Message: '+JSON.stringify(tangleData, null, 2))
            })
        }
    })
})
