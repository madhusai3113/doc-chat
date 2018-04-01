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

// AutoClick for fileupload
    // $scope.selectFile = function(){
    //     $("#fileicon").click();
    // }

    // UploadFile Function
    $scope.uploadFile = function(files){
        $scope.$apply(function($scope) {
            $scope.theFile = files[0].name;
            console.log($scope.theFile);
        });

        var message = JSON.stringify({
            message: "<a>" +$scope.theFile + "</a>",
            sender: this.user_id,
            recipient: 0,
            userStatus: this.chatStatus
        });
        this.socket.emit('chat message', message);

        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);

        uploadFiles(files[0]);


        // $http.post("file:///home/madhusai/Desktop/used/node/test/public/fileUpload", fd, {
        //     withCredentials: true,
        //     headers: {'Content-Type': undefined },
        //     transformRequest: angular.identity
        // }).success().error();

    }

    function uploadFiles(formData) {
        $.ajax({
            url: '/upload_photos',
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
            xhr: function () {
                var xhr = new XMLHttpRequest();
    
                // Add progress event listener to the upload.
                xhr.upload.addEventListener('progress', function (event) {
                    var progressBar = $('.progress-bar');
    
                    if (event.lengthComputable) {
                        var percent = (event.loaded / event.total) * 100;
                        progressBar.width(percent + '%');
    
                        if (percent === 100) {
                            progressBar.removeClass('active');
                        }
                    }
                });
    
                return xhr;
            }
        }).done(handleSuccess).fail(function (xhr, status) {
            alert(status);
        });
    }



}]);


