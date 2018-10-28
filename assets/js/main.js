var iota = new IOTA({'provider': 'https://nodes.testnet.iota.org:443'})

function getIpData(cb) {
    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
        cb(JSON.stringify(data, null, 2));
    });
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
    console.log('-- fetching from tangle --', 'bundle-hash:', $('#bundle-hash').val());
     var bundle = $('#bundle-hash').val()
    // console.log('bundle:', bundle)
    var bundles = new Set();
    var searchVarsBundle = {
        'bundles': [bundle]
    }
    var message = ''
    iota.api.findTransactions(searchVarsBundle, function(error, success) {
        if (error) {
            console.log('error:', error)
        } else {
            iota.api.getBundle(success[0], function(error, success2) {
                if (error) {
                    console.log('error:', error)
                } else {
                    message = success2[0].signatureMessageFragment
                    message = message.split("9").join("")
                    $('#message-trytes').html('Message Trytes: '+message)
                    var rawMessage = iota.utils.fromTrytes(message)
                    $('#tangle-data').html('Message: '+rawMessage)
                }
            })
        }
    })
})
