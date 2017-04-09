'use strict';
/**
 * @ngdoc overview
 * @name rideSharing:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular
 */
angular
    .module('rideSharing')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('auth', {
                url: '/auth',
                templateUrl: 'modules/auth/main.html'
            })
            .state('auth.sign-up', {
                url: '/sign-up',
                templateUrl: 'modules/auth/sign-up.html',
                controller: 'SignUp as SignUp'
            })
            .state('auth.log-in', {
                url: '/log-in',
                templateUrl: 'modules/auth/log-in.html',
                controller: 'LogIn as LogIn'
            })
            .state('ride-share', {
                url: '/ride-share',
                controller: 'RideShare as RideShare',
                templateUrl: 'modules/ride-share/main.html',
            })
            .state('ride-share.commuters', {
                url: '/commuters',
                controller: 'Commuters as Commuters',
                templateUrl: 'modules/ride-share/commuters.html',
            })
            .state('ride-share.owners', {
                url: '/owners',
                controller: 'Owners as Owners',
                templateUrl: 'modules/ride-share/owners.html'
            });

        $urlRouterProvider.otherwise('/auth/sign-up');
    });
