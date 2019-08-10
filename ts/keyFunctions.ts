var selected_post;

var app = angular.module('keyBindings', []);
app.controller('keybindings_ctrl', function($scope)
{
    $scope.setSelectedPost = function(id)
    {
        console.log("Selected Post: " + id);
        $(id).css("border-color", "#ffffff");
    }
});
