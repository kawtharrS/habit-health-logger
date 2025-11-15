<?php 

//array of routes - a mapping between routes and controller name and method!
$apis = [
    '/users/id'             => ['controller' => 'UserController', 'method' => 'getUserById'],
    '/users'                => ['controller' => 'UserController', 'method' => 'getAllUsers'],
    '/users/create'         => ['controller' => 'UserController', 'method' => 'insertUser'],
    '/users/delete'         => ['controller' => 'UserController', 'method' => 'deleteUser'],
    '/users/update'         => ['controller' => 'UserController', 'method' => 'updateUser'],
];


