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
    return new Promise(resolve => {
        setTimeout(() => {
            $(id).attr('hidden', true);
            resolve("resolved");
        }, 10);
    });
}

function showElement(id)
{
    return new Promise(resolve => {
        setTimeout(() => {
            $(id).attr('hidden', false);
            resolve("resolved");
        }, 10);
    });
}


var app = angular.module('RedDesk', []);
app.controller('reddesk_ctrl', function($scope, $http){

    $scope.dynamicDropdown = function()
    {
        var subreddits = "https://api.reddit.com/subreddits/mine/subscriber";

        $http.get(subreddits).then(function(response)
        {
            $scope.subreddits = response.data.data.children;
        });
    }

    $scope.getUserInfo = function()
    {
        console.log("Test");
    }

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

        post_count = 25;         // count
        last_post = null;       // after2
        last_type = null;       // after1

        console.log("New URL" + reddit_url);

        $scope.getPosts();
    }

    // Gets post listing
    $scope.getPosts = async function()
    {
        var spin = await start_spinner();

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
        spin = await stop_spinner();
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

    // Will grab individual post image and display it as fullscreen

    // Old Code
    // $scope.openPost = async function(permalink)
    // {
    //     // console.log("Saving to Cache");
    //     // var json = '{\n\t"id": "' + id + '",\n\t "read": ' + true + '\n}\n';
    //     // var json = "id: '" + id + "', read: " + true;
    //     // fs.appendFileSync('cache.json', json);
    //     console.log("Opening Post: " + permalink);

    //     // HTTP Request below for grabbing post info
    //     var complete_url = "https://api.reddit.com" + permalink;

    //     console.log("Post URL: " + complete_url);

    //     $http.get(complete_url).then(function(response)
    //     {
    //         $scope.Full_Post = response.data[0].data.children[0].data;
    //         console.log("Full Post: ");
    //         console.log($scope.Full_Post);
    //     });

    //     // Showing id
    //     var expanded_post = await showElement('#expanded_post');
        
    //     console.log("Post Found: " + post);
    // }

    $scope.closePost = async function()
    {
        console.log("Closing Post");
        var expanded_post = await hideElement('#expanded_post');
    }
});



// New code for dynamic post dropdowns
function getPost(permalink, id)
{

    if(permalink || id)
    {
        $.get("https://api.reddit.com" + permalink, function(data, status)
        {
            if(status == "success")
            {
                console.log("ID: " + id + "Data:");
                console.log(data);
            }
            else
            {
                console.log("Something Went wrong with retrevial of Post");
            }
            
        });
    }
    else
    {
        console.log("Invalid Post")
    }

    
}

function changeLocation(url)
{
    // window.location.assign("https://reddit.com/login");
    window.location.assign(url);

}