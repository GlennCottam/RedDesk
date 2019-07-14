function checkLogin()
{
    var url = "https://api.reddit.com/api/v1/me/";

    $.get(url).then(function(response)
    {
        console.log(response);
    });
}