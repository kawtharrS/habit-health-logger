<?php 

//array of routes - a mapping between routes and controller name and method!
$apis = [
    '/users/id'             => ['controller' => 'UserController', 'method' => 'getUserById'],
    '/users'                => ['controller' => 'UserController', 'method' => 'getAllUsers'],
    '/users/create'         => ['controller' => 'UserController', 'method' => 'insertUser'],
    '/users/delete'         => ['controller' => 'UserController', 'method' => 'deleteUser'],
    '/users/update'         => ['controller' => 'UserController', 'method' => 'updateUser'],

    '/habits/id'             => ['controller' => 'HabitController', 'method' => 'getHabitById'],
    '/habits'                => ['controller' => 'HabitController', 'method' => 'getAllHabits'],
    '/habits/create'         => ['controller' => 'HabitController', 'method' => 'insertHabit'],
    '/habits/delete'         => ['controller' => 'HabitController', 'method' => 'deleteHabit'],
    '/habits/update'         => ['controller' => 'HabitController', 'method' => 'updateHabit'],

    '/entries/id'             => ['controller' => 'EntryController', 'method' => 'getEntryById'],
    '/entries'                => ['controller' => 'EntryController', 'method' => 'getAllEntries'],
    '/entries/create'         => ['controller' => 'EntryController', 'method' => 'insertEntry'],
    '/entries/delete'         => ['controller' => 'EntryController', 'method' => 'deleteEntry'],
    '/entries/update'         => ['controller' => 'EntryController', 'method' => 'updateEntry'],

];


