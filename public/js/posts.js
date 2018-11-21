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
    });

})