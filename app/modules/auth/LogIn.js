'use strict';

/**
 * @ngdoc function
 * @name rideSharing.controller:LogIn
 * @description
 * # LogIn
 * Controller of the rideSharing
 */
angular
    .module('rideSharing')
    .controller('LogIn', [
        '$scope', '$http', '$state', '$window', 'Utils',
        function ($scope, $http, $state, $window, Utils) {
            var logIn = this;
            logIn.user = {};

            if ($window.localStorage.getItem('users')) {
                logIn.users = JSON.parse($window.localStorage.getItem('users'));
            } else {
                $http({
                    method: 'GET',
                    url: 'json/users.json'
                }).then(function (response) {
                    logIn.users = response.data;
                });
            }

            logIn.verifyUser = function () {
                var flag = 0, currentUser;
                angular.forEach(logIn.users, function (user) {
                    if ((user.email === logIn.user.name || user.phone === logIn.user.name) &&
                        user.password === logIn.user.password) {
                        flag = 1;
                        currentUser = user;
                        $window.localStorage.setItem('isLoggedIn', true);
                        $window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        if (currentUser.isOwner) {
                            $state.go('ride-share.owners');
                        } else {
                            $state.go('ride-share.commuters');
                        }
                        Utils.successToastr('You are successfully logged in!');
                    }
                });

                if (flag === 0) {
                    Utils.errorToastr('Your login credentials are not correct. Please retry.');
                }
            };
        }
    ]);
