const angular = require('angular');

// TODO: Create caching system for posts
// TODO: Create ajax query to pull posts

var posts;

function getPosts(subreddit, sort)
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
        }
    });
}