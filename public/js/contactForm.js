$('#contactForm').submit(function (e) {
    e.preventDefault()
    
    setTimeout(() => {
        const formData = {
            first_name: $('input[name=first_name]').val(),
            last_name: $('input[name=last_name]').val(),
            email: $('input[name=email]').val(),
            tel: $('input[name=tel]').val(),
            message: $('textarea[name=message]').val()
        }

        $.ajax({
            type: 'POST',
            url: '/cf',
            data: formData,
            success: function (response) {
                $('#response').html(response);
            },
            error: function (error) {
                console.error('Erreur lors de la requête AJAX :', error);
            }
        })
    }, 1500);
})