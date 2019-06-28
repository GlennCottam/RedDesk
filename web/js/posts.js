// TODO: Create caching system for posts

// default subreddit grab
var jsonFile = require('jsonfile');
var reddit_url = "https://api.reddit.com/hot/";

var post_count = 25;         // count
var last_post = null;       // after2
var last_type = null;       // after1

var posts;


function imgError(image){
    image.style.display = 'none';
}

var app = angular.module('RedDesk', []);
app.controller('reddesk_ctrl', function($scope, $http){

    $scope.getPosts = function()
    {
        // http request url: reddit_url + ?limit=get_size + &after=LastPost + &count=Post_Count
        var complete_url = reddit_url + "?limit=" + post_count + "&after=" + last_type + "_" + last_post + "&count=" + post_count;
        console.log(complete_url);
        $http.get(complete_url).then(function(response)
        {
            $scope.posts = response.data.data.children;
            // console.log($scope.posts);
            post_count = post_count + post_count;

            // console.log("post count = " + post_count);
            last_post = $scope.posts[post_count - 1].data.id;
            last_type = $scope.posts[post_count - 1].kind;

            console.log("Last Post: " + last_type + "_" + last_post);
        });
    }

    $scope.onBottom = function()
    {
        var $win = $(window);
        $win.scroll(function()
        {
            if($win.height() + $win.scrollTop() == $(document).height())
            {
                console.log("Geting More Posts");
                $scope.getPosts();
            }
        });
    }

    $scope.openPost = function(id)
    {
        console.log("Saving to Cache");
        jsonFile.writeFile('cache.json', 'id: ' + id + " read:" + true);
    }
});