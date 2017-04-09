'use strict';

/**
 * @ngdoc function
 * @name rideSharing.controller:SignUp
 * @description
 * # SignUp
 * Controller of the rideSharing
 */
angular
    .module('rideSharing')
    .controller('SignUp', [
        '$scope', '$http', '$state', '$window', 'Utils',
        function ($scope, $http, $state, $window, Utils) {
            var signUp = this;
            signUp.newUser = {
                type: 'owner'
            };

            if ($window.localStorage.getItem('users')) {
                signUp.users = JSON.parse($window.localStorage.getItem('users'));
            } else {
                $http({
                    method: 'GET',
                    url: 'json/users.json'
                }).then(function (response) {
                    signUp.owners = response.data;
                });
                $http({
                    method: 'GET',
                    url: 'json/commuters.json'
                }).then(function (response) {
                    signUp.commuters = response.data;
                });
            }

            signUp.createNewUser = function () {
                // Add this for proper validation on mobile
                if (signUp.newUser.name === '' || signUp.newUser.password === '') {
                    Utils.infoToastr('You need to enter both username and passowrd');
                    return;
                }
                var flag = 0, users;
                if (signUp.newUser.type === 'owner') {
                    users = signUp.owners;
                } else {
                    users = signUp.commuters;
                }
                angular.forEach(users, function (user) {
                    if (user.email === signUp.newUser.email ||
                        user.phone === signUp.newUser.phone) {
                        flag = 1;
                        Utils.infoToastr('Please log in to continue', 'You are already an existing user!');
                    }
                });

                if (flag === 0) {
                    signUp.newUser.id = users.length + 1;
                    users.push(signUp.newUser);
                    $window.localStorage.setItem('users', JSON.stringify(users));
                    Utils.successToastr('Please log in to continue', 'Hola, you are successfully signed up!');
                }
                $state.go('auth.log-in');
            };
        }
    ]);
