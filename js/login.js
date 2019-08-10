// Below code will authorize application to the user account (I hope)
// Docs for reddit 0auth2 found here: https://github.com/reddit-archive/reddit/wiki/OAuth2
function get_authorization() {
    var url = "https://www.reddit.com/api/v1/authorize?";
    var client_id = "nviXQvOzIuBYVw"; // ID for RedDesk Application
    var response_type = "code"; // Type
    var state = ""; // Token
    var redirect_url = "http://localhost"; // Redirect URL
    var duration = "permanent"; // Either temporary or permanent
    var scope = "identity"; // What you want to do with the API
    var complete_url = url + "client_id=" + client_id + "&response_type=" + response_type + "&state=" + state + "&redirect_url=" + redirect_url + "&duration=" + duration + "&scope=" + scope;
    console.log("Complete sign in URL: " + complete_url);
    window.location.assign(complete_url);
}
function checkLogin() {
}
function changePage(url) {
    window.location.assign(url);
}
