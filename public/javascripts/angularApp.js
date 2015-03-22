var app = angular.module('flapperNews', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        
        $stateProvider
        .state(
            'home',
            {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainController',
                resolve: {
                    postPromise: ['posts', function(posts) {
                        return posts.getAll();
                    }]
                }
            })
        .state(
            'posts',
            {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsController',
                resolve: {
                    post: ['$stateParams', 'posts', function($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            })
        .state(
            'login',
            {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthController',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn())
                    {
                        $state.go('home');
                    }
                }]
            })
        .state(
            'register',
            {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthController',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn())
                    {
                        $state.go('home');
                    }
                }]
            });
        
        $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', 'auth', function($http, auth) {
    var postFactory = {};
    postFactory.posts = [];

    postFactory.getAll = function() {
        return $http.get('/posts').success(function(data) {
            angular.copy(data, postFactory.posts);
        });
    };

    postFactory.create = function(post) {
        return $http.post('/posts', post, { headers: { Authorization: 'Bearer ' + auth.getToken() } })
            .success(function(data) {
                postFactory.posts.push(data);
        });
    };

    postFactory.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote', null, { headers: { Authorization: 'Bearer ' + auth.getToken() } })
            .success(function(data) {
                post.upvotes += 1;
            });
    };

    postFactory.get = function(id) {
        return $http.get('/posts/' + id).then(function(res) {
            return res.data;
        });
    };

    postFactory.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment,  { headers: { Authorization: 'Bearer ' + auth.getToken() } });
    };

    postFactory.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null,  { headers: { Authorization: 'Bearer ' + auth.getToken() } })
          .success(function(data) {
              comment.upvotes += 1;
          });
    };

    return postFactory;
}]);

app.factory('auth', ['$http', '$window', function($http, $window) {
    var authFactory = {};

    authFactory.saveToken = function(token) {
        $window.localStorage['flapper-news-token'] = token;
    };

    authFactory.getToken = function() {
        return $window.localStorage['flapper-news-token'];
    };

    authFactory.isLoggedIn = function() {
        var token = authFactory.getToken();
        if (token)
        {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        }
        else
        {
            return false;
        }
    };

    authFactory.currentUser = function() {
        if (authFactory.isLoggedIn())
        {
            var token = authFactory.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    authFactory.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            authFactory.saveToken(data.token);
        });
    };

    authFactory.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            authFactory.saveToken(data.token);
        });
    };

    authFactory.logOut = function() {
        $window.localStorage.removeItem('flapper-news-token');
    };

    return authFactory;
}]);

app.controller('MainController', [
    '$scope',
    'posts',
    'auth',
    function($scope, posts, auth){
        $scope.posts = posts.posts;
        $scope.isLoggedIn = auth.isLoggedIn;
        
        $scope.addPost = function(){
            if (!$scope.title || $scope.title === '') {
                return;
            }

            posts.create({
                title: $scope.title,
                link: $scope.link
            });
            
            $scope.title = '';
            $scope.link = '';
        };
        
        $scope.incrementUpvotes = function(post){
          posts.upvote(post);
        };
}]);

app.controller('PostsController', [
    '$scope',
    'posts',
    'post',
    'auth',
    function($scope, posts, post, auth) {
        $scope.post = post;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addComment = function(){
            if (!$scope.body || $scope.body === '')
            {
                alert('no comment body');
                return;
            }

            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user'
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });

            $scope.body = '';
        };

        $scope.incrementUpvotes = function(comment) {
            posts.upvoteComment(post, comment);
        };
    }
]);

app.controller('AuthController', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function() {
            auth.register($scope.user)
                .error(function(error) {
                    $scope.error = error;
                })
                .then(function() {
                    $state.go('home');
                });
        };

        $scope.logIn = function() {
            auth.logIn($scope.user)
                .error(function(error) {
                    $scope.error = error;
                })
                .then(function() {
                    $state.go('home');
                });
        };
}]);

app.controller('NavigationController', [
    '$scope',
    'auth',
    function($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
}]);