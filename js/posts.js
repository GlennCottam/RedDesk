// import { loadavg } from "os";
// TODO: Create caching system for posts
// default subreddit grab
var reddit_url = "https://api.reddit.com/best";
// writing to "cache"
// var fs = require('fs');
var last_sort = "hot";
var last_sub = null;
var selectedID;
var old_selectedID;
var post_count = 25; // count
var last_post = null; // after2
var last_type = null; // after1
// Array of posts
var post_array;
// Startup Script
$(document).ready(function () {
    console.log("Starting...");
    angular.element($("body")).scope().getPosts();
});
// Ajax Functions
// Pulls the reddit posts, and stores them in "posts" variable for later use.
// Each time function is run, it will overwrite the posts (posts = posts + more posts)
// TODO: TO spare memory: only pull a total of x amount of posts and remove the other ones. Current function will take longer and longer to load the more it loads.
async function pullRedditPosts() {
    // Default URL
    var complete_url = reddit_url + "?limit=" + post_count + "&after=" + last_type + "_" + last_post + "&count=" + post_count;
    try {
        await $.get({ url: complete_url, timeout: 1000 }).then(function (response) {
            post_array = response.data.children;
            post_count = post_count + post_count;
            console.log(post_array);
            // If posts did not load or something happend, this will set the last post to either null, or to the last post in the array
            if (post_array[post_count - 1] == null) {
                last_post = null;
                last_type = null;
            }
            else {
                last_post = post_array[post_count - 1].data.id;
                last_type = post_array[post_count - 1].kind;
            }
            console.log("Posts Retrieved");
        });
    }
    catch (error) {
        logConsole("Error Pulling Posts \n\tError: " + error.statusText + "\n\t" + "Status: " + error.status, 'error');
        // console.log("Error Pulling Posts \n\tError: " + error.statusText + "\n\t" + "Status: " + error.status);
    }
}
function imgError(image) {
    image.style.display = 'none';
}
async function hideElement(id) {
    $(id).attr('hidden', true);
    resolve("resolved");
}
async function showElement(id) {
    $(id).attr('hidden', false);
    resolve("resolved");
}
var app = angular.module('RedDesk', []);
app.controller('reddesk_ctrl', function ($scope, $http) {
    $scope.dynamicDropdown = function () {
        var subreddits = "https://api.reddit.com/subreddits/mine/subscriber";
        $http.get(subreddits).then(function (response) {
            $scope.subreddits = response.data.data.children;
        });
    };
    $scope.getUserInfo = function () {
        console.log("Test");
    };
    $scope.getConfig = function () {
        console.log("From Settings.js: " + last_sub + last_sort);
    };
    $scope.setGetUrl = function (sub, sort) {
        console.log("Setting Subreddit");
        if (sub == null) {
            reddit_url = "https://api.reddit.com/" + sort;
            last_sort = sort;
        }
        else {
            reddit_url = "https://api.reddit.com/" + "r/" + sub + "/" + sort;
            last_sort = sort;
            last_sub = sub;
        }
        post_count = 25; // count
        last_post = null; // after2
        last_type = null; // after1
        console.log("New URL" + reddit_url);
        $scope.getPosts();
    };
    // Gets post listing
    $scope.getPosts = async function () {
        await start_spinner();
        console.log("Pulling reddit posts");
        await pullRedditPosts();
        console.log("Reddit posts pulled, setting array.");
        $scope.posts = post_array;
        console.log("Post List Below:");
        console.log($scope.posts);
        $("#main").attr('hidden', false);
        await stop_spinner();
    };
    $scope.setSelectedPost = function (id) {
        console.log('Selected Post: ' + id);
        $('#post_' + id).css('border-color', '#FF0000'); // Sets border-color
        if (selectedID == null) {
            selectedID = id;
        }
        else {
            // selectedID.css('border-color', '#212529');
            $('#post_' + selectedID).css('border-color', '#212529');
            selectedID = id;
        }
    };
    $scope.onBottom = function () {
        var $win = $(window);
        $win.scroll(function () {
            if ($win.height() + $win.scrollTop() == $(document).height()) {
                console.log("Geting More Posts");
                $scope.getPosts();
            }
        });
    };
    $scope.convertMarkdown = function (id) {
        console.log("Converting to Markdown: " + id);
        var text = $("#" + id + " .convert_markdown").html(), target = $("#" + id + " .convert_markdown"), converter = new showdown.Converter();
        html = converter.makeHtml(text);
        target.html('');
        target.html(html);
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    };
    $scope.closePost = async function () {
        console.log("Closing Post");
        var expanded_post = await hideElement('#expanded_post');
    };
});
// New code for dynamic post dropdowns
function getPost(permalink, id) {
    if (permalink || id) {
        $.get("https://api.reddit.com" + permalink, function (data, status) {
            if (status == "success") {
                console.log("ID: " + id + "Data:");
                console.log(data);
            }
            else {
                console.log("Something Went wrong with retrevial of Post");
            }
        });
    }
    else {
        console.log("Invalid Post");
    }
}
// Either upvotes post, or downvotes post.
function upDownPost(id, up) {
    console.log("Post: " + id + "\nUp?: " + up);
}
// Listening for 'x' key (open selected post)
$(document).keypress(function (key) {
    if (key.key == 'x') {
        console.log(selectedID);
        $("#post_" + selectedID + ' .collapse').collapse('toggle');
    }
    else if (key.key == 'a') {
        console.log("Upvoting: " + selectedID);
        upDownPost(selectedID, true);
    }
    else if (key.key == 'z') {
        console.log("Downvoting: " + selectedID);
        upDownPost(selectedID, false);
    }
});
function changeLocation(url) {
    window.location.assign(url);
}
