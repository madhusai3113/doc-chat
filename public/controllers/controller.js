var myapp = angular.module('myApp', []);

myapp.controller('AppController', ['$scope', '$http', function ($scope, $http) {
    console.log('controller taken position');
    
    $scope.chatStatus = -1;
    $scope.message = "";
    $scope.user = "";
    $scope.socket = null;

    // complete
    var refreshChat = function () {
        let filter = JSON.stringify({
            user_id: $scope.user_id,
            part_id: 0
        });
        $http.post('/chat/messages', filter).success(function (response) {
            $scope.prevMessages = response;
        });
    }

    // complete
    $scope.requestChat = function () {
        if ($scope.chatStatus === -1) {
            this.socket = new io();
            $http.get('/newclient').success(function (response) {
                $scope.user_id = response;
                $scope.chatStatus = 1;
                console.log('user id alloted: ' + $scope.user_id);
            });

            this.socket.on('new message', function (message) {
                console.log(message);
                if(message.sender===0)
                {
                    var cel = `<h3><span class="msg_right label label-default">${message.message}</span></h3><br>`;
                }
                else
                {
                    var cel = `<h3><span class="msg_left label label-default">${message.message}</span></h3><br>`;
                }
                $("#chat-messages").append(cel);
                // console.log(message.userStatus);
                $scope.chatStatus = message.userStatus;
            });
        }
    }

    $scope.showChat = function () {
        console.log('Showing chat window');
        this.chatStatus = 0;
    }

    $scope.endChat = function () {
        $scope.chatStatus = -1;
        this.socket.disconnect();
    }

    // complete
    $scope.sendMessage = function () {
        if (this.message !== "") {
            
            console.log(this.chatStatus);
            var message = JSON.stringify({
                message: this.message,
                sender: this.user_id,
                recipient: 0,
                userStatus: this.chatStatus
            });
            var messtext = this.message;
            
            $http.post('/chat', message).success(function (response) {
                // let cel = `<div> ${messtext} </div>`;
                // $("#chat-messages").append(cel);
                console.log(response);
            });
            this.socket.emit('chat message', message);
            
            this.message = "";
            // refreshChat();
        }
    }





}]);