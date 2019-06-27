function toLight()
{
    console.log("Switching to light theme");
    $("#mainStyle").attr('href', 'css/light.css');
}

function toDark()
{
    console.log("Switching to dark theme");
    $("#mainStyle").attr('href', 'css/dark.css');
}