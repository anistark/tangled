$('#push-data').click(function() {
    console.log('-- pushing to mam clicked --');
    $.ajax({
        url: "/mam/push",
        method: 'POST',
        data: {
            'data': $('#comment').val(),
            'seed': $('#seed').val()
        },
        // xhr: function() {
        //     console.log('in xhr');
        // },
        success: function(responseData) {
            console.log('responseData:', responseData);
        },
        error: function (errorData) {
            console.log('errorData:', errorData);

        }
    });
})

$('#fetch-data').click(function() {
    console.log('-- fetching from mam clicked --');
    $.ajax({
        url: "/mam/fetch",
        method: 'POST',
        data: {
            'root': $('#rootHash').val(),
            'seed': $('#fetch-seed').val()
        },
        // xhr: function() {
        //     console.log('in xhr');
        //     // return new($('#my_api_iframe')[0].contentWindow.XMLHttpRequest)();
        // },
        success: function(responseData) {
            console.log('responseData:', responseData);
            $('#mam-data').html(responseData)
        },
        error: function (errorData) {
            console.log('errorData:', errorData);

        }
    });
})
