$(document).ready(function () {
    $('#input-text').on('input propertychange paste change', function () {
        $.ajax({
            method: "POST",
            url: "/getrating",
            data: {
                text: $('#input-text').val()
            },

            success: function (data) {
                $('#act-rating').text(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR");
            }
        });
    });

});