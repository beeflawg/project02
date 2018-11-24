$(function () {
    $(".create-form").on("submit", function (event) {
        event.preventDefault();

        var newPost = {
            title: $("#title").val().trim(),
            body: $("#body").val().trim(),
        };

        $.ajax("/api/posts", {
            type: "POST",
            data: newPost
        }).then(function () {
            console.log("Post submitted");
            window.location.replace("/home");
        });
    });

    $.get("/api/user_data").then(function (data) {
        $(".member-name").text(data.email);
        $(".user").attr("href", "/user/" + data.id);
    });

    $('#customFile').on('change', function(){
        //get the file name
        var fileName = $(this).val().split('\\').pop();
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').addClass("selected").html(fileName);
    });

    $("button.delete").on('click', function(event){
        event.preventDefault();

        var id = $("button.delete").attr('data-id');

        $.ajax('/api/posts/' + id, {
            method: "DELETE"
        }).then(function(){
            location.reload();
        });
    });
});