// TODO: Create caching system for posts

var posts;

function getPosts(subreddit, sort, callback)
{
    if(sort == null)
    {
        sort = "hot";
    }

    $.get({
        url: "https://www.reddit.com/r/" + subreddit + "/new.json?sort=" + sort,
        success: function(result)
        {
            console.log("Posts retrieved");
            posts = result.data;
        }
    });

    callback();
}

function imgError(image){
    image.style.display = 'none';
}

var app = angular.module('RedDesk', []);
app.controller('reddesk_ctrl', function($scope, $http){

    $scope.getPosts = function()
    {
        $http.get("https://www.reddit.com/r/pcmasterrace/hot.json?").then(function(response)
        {
            $scope.posts = response.data.data.children;
            console.log($scope.posts);
        });
    }
});