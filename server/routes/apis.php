<?php 

//array of routes - a mapping between routes and controller name and method!
$apis = [
    '/users/create'         => ['controller' => 'UserController', 'method' => 'insertUser'],
    '/users/delete'         => ['controller' => 'UserController', 'method' => 'deleteUser'],
    '/users/update'         => ['controller' => 'UserController', 'method' => 'updateUser'],
];


