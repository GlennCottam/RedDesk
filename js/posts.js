// TODO: Create caching system for posts
// default subreddit grab
var reddit_url = "https://api.reddit.com/hot";

// writing to "cache"
// var fs = require('fs');

var last_sort = "hot";
var last_sub = null;


var post_count = 25;         // count
var last_post = null;       // after2
var last_type = null;       // after1

var posts;

function imgError(image){
    image.style.display = 'none';
}

function hideElement(id)
{
    $(id).attr('hidden', true);
}

function showElement(id)
{
    $(id).attr('hidden', false);
}


var app = angular.module('RedDesk', []);
app.controller('reddesk_ctrl', function($scope, $http){

    $scope.getConfig = function()
    {
        console.log("From Settings.js: " + last_sub + last_sort);
    }

    $scope.setGetUrl = function(sub, sort)
    {
        console.log("Setting Subreddit");

        if(sub == null)
        {
            reddit_url = "https://api.reddit.com/" + sort;
            last_sort = sort;
        }
        else
        {
            reddit_url = "https://api.reddit.com/" + "r/" + sub + "/" + sort;
            last_sort = sort;
            last_sub = sub;
        }

        console.log("New URL" + reddit_url);

        $scope.getPosts();
    }

    $scope.getPosts = function()
    {
        // http request url: reddit_url + ?limit=get_size + &after=LastPost + &count=Post_Count
        var complete_url = reddit_url + "?limit=" + post_count + "&after=" + last_type + "_" + last_post + "&count=" + post_count;
        console.log(complete_url);
        $http.get(complete_url).then(function(response)
        {
            $scope.posts = response.data.data.children;



            console.log($scope.posts);
            post_count = post_count + post_count;

            // console.log("post count = " + post_count);

            if($scope.posts[post_count - 1] == null)
            {
                console.log("No Data Found");
                last_post = null;
            }
            else
            {
                last_post = $scope.posts[post_count - 1].data.id;
            }

            
            last_type = $scope.posts[post_count - 1].kind;

            
            console.log("Last Post: " + last_type + "_" + last_post);
            
        });
        $("#main").attr('hidden', false);
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
        var json = '{\n\t"id": "' + id + '",\n\t "read": ' + true + '\n}\n';
        // var json = "id: '" + id + "', read: " + true;
        fs.appendFileSync('cache.json', json);
    }
});