var iota = new IOTA({
    'host': 'https://nodes.testnet.iota.org',
    'port': 443
})

$('#to-trytes-btn').click(function() {
    console.log('-- convert to trytes clicked --');
    var tryteString = iota.utils.toTrytes($('#string-data').val());
    $('#trytes-converted-data').html(tryteString)
})

$('#to-string-btn').click(function() {
    console.log('-- convert to string clicked --');
    var stringData = iota.utils.fromTrytes($('#tryte-data').val());
    console.log('stringData:', stringData);
    $('#string-converted-data').html(stringData)
})
