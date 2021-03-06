// import { loadavg } from "os";

// TODO: Create caching system for posts
var angular = require('angular');
// default subreddit grab
var reddit_url = "https://api.reddit.com/best";

// writing to "cache"
// var fs = require('fs');

var last_sort = "hot";
var last_sub = null;

var selectedID;
var old_selectedID;


var post_count = 25;         // count
var last_post = null;       // after2
var last_type = null;       // after1

// Array of posts
var post_array;

// Startup Script
$(document).ready(async function()
{
    console.log("1. Starting...");
    await angular.element($("body")).scope().getPosts();
});

// Ajax Functions

// Pulls the reddit posts, and stores them in "posts" variable for later use.
// Each time function is run, it will overwrite the posts (posts = posts + more posts)
// TODO: TO spare memory: only pull a total of x amount of posts and remove the other ones. Current function will take longer and longer to load the more it loads.
async function pullRedditPosts()
{
    await start_spinner();
    // Default URL
    var complete_url = reddit_url + "?limit=" + post_count + "&after=" + last_type + "_" + last_post + "&count=" + post_count;

    try
    {
        await $.get({url:complete_url}).then(function(response)
        {
            post_array = response.data.children;
            post_count = post_count + post_count;
            console.log(post_array);
        
            // If posts did not load or something happend, this will set the last post to either null, or to the last post in the array
            if(post_array[post_count - 1] == null)
            {
                last_post = null;
                last_type = null;
            }
            else
            {
                last_post = post_array[post_count - 1].data.id;
                last_type = post_array[post_count - 1].kind;
            }
            console.log("2. Posts Retrieved");
        });
    }
    catch(error)
    {
        logConsole("Error Pulling Posts \n\tError: " + error.statusText + "\n\t" + "Status: " + error.status, 'error');
        // console.log("Error Pulling Posts \n\tError: " + error.statusText + "\n\t" + "Status: " + error.status);
    }
}


function imgError(image){
    image.style.display = 'none';
}

async function hideElement(id)
{
    return new Promise(resolve => {
        $(id).attr('hidden', true);
        resolve("resolved");
    });
    
}

async function showElement(id)
{
    return new Promise(resolve => {
        $(id).attr('hidden', false);
        resolve("resolved");
    })
}


var app = angular.module('RedDesk', []);
app.controller('reddesk_ctrl', function($scope, $http){

    $scope.dynamicDropdown = function()
    {
        var subreddits = "https://api.reddit.com/subreddits/mine/subscriber";

        $http.get(subreddits).then(function(response)
        {
            $scope.subreddits = response.data.children;
            console.log("Subreddit List:\n" + $scope.subreddits);
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

        console.log("New URL " + reddit_url);

        $scope.getPosts();
    }

    // Gets post listing
    $scope.getPosts = async function()
    {
        await start_spinner();
        await pullRedditPosts();

        $scope.posts = post_array;
        await post_prep();
        console.log("Post List Below:");
        console.log($scope.posts);

        /*
            Put new Code Below
            This below code will re-create the function of angular but with a finite function
            This will replace most of angulars logic, in order to make it run better and more accuratly
        */

        /*
            Common Elements:
                1. post_{{post.kind}}_{{post.data.id}} = Main Post Container
                    - use for main repeated function 
                2. post{{post.kind}}_{{post.data.id}_thum = Thumbnail Spot
                3. {{post.kind}}_{{post.data.id}}_saved = If post is saved or not
                4. {{post.kind}}_{{post.data.id}}_dropdown = Main Dropdown
                    - Put your cool shit in here fam
        */

        // await $scope.posts.forEach(function(item, index)
        // {
        //     var saved = $("#" + item.kind + "_" + item.data.id + "_saved");
        //     var thumbnail = $("#" + item.kind + "_" + item.data.id + "_thumb");
        //     // If Saved Function
        //     if(item.data.saved === false)
        //     {
        //         saved.removeClass("text-warning");
        //     }
        //     // If post has image
        //     if(item.data.thumbnail)
        //     {
        //         thumbnail.attr('src', item.data.thumbnail);
        //         thumbnail.attr('hidden', false);
        //     }

        // });

        await showElement("#main");
        await stop_spinner();
        console.log("4. Finished Retrival and JS scripting")
    }

    $scope.setSelectedPost = function(id)
    {
        console.log('Selected Post: ' + id);
        $('#post_' + id).css('border-color', '#FF0000'); // Sets border-color

        if(selectedID == null)
        {
            selectedID = id;
        }
        else
        {
            // selectedID.css('border-color', '#212529');
            $('#post_' + selectedID).css('border-color', '#212529');
            selectedID = id;
        }        
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

    $scope.convertMarkdown = function(id)
    {
        console.log("Converting to Markdown: " + id);

        var text = $("#" + id + " .convert_markdown").html(),
            target = $("#" + id + " .convert_markdown"),
            converter = new showdown.Converter();
            html = converter.makeHtml(text);
    
        target.html('');
        target.html(html);
    
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    $scope.closePost = async function()
    {
        console.log("Closing Post");
        var expanded_post = await hideElement('#expanded_post');
    }
});

function post_prep()
{
    return new Promise(resolve => {
        console.log("3. Processing JSON Data")
        post_array.forEach(function(item, index)
        {
            var saved = $("#" + item.kind + "_" + item.data.id + "_saved");
            var thumbnail = $("#" + item.kind + "_" + item.data.id + "_thumb");
            // If Saved Function
            if(item.data.saved === false)
            {
                saved.removeClass("text-warning");
            }
            // If post has image
            if(item.data.thumbnail)
            {
                thumbnail.attr('src', item.data.thumbnail);
                thumbnail.attr('hidden', false);
            }
        });
        resolve("resolved");
    });
}

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

// Either upvotes post, or downvotes post.
function upDownPost(id, up)
{
    console.log("Post: " + id + "\nUp?: " + up);
}

// Listening for 'x' key (open selected post)
$(document).keypress(function(key)
{
    if(key.key == 'x')
    {
        console.log(selectedID);
        $("#post_" + selectedID + ' .collapse').collapse('toggle');
    }
    else if(key.key == 'a')
    {
        console.log("Upvoting: " + selectedID);
        upDownPost(selectedID, true);
    }
    else if(key.key == 'z')
    {
        console.log("Downvoting: " + selectedID);
        upDownPost(selectedID, false);
    }

});

function changeLocation(url)
{
    window.location.assign(url);
}




/*
    Notes on how I want this garbage to work
    Step 1: Get list of posts from reddit
    Step 2: use angular to generate individual cards with NO DATA, with ID's unique to post.
    Step 3: use ID's to fill in information
    Step 4: show posts.
*/
