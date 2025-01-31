<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Options
    |--------------------------------------------------------------------------
    |
    | Here you may configure the settings for handling CORS requests. You may
    | set the paths, allowed methods, and other options for the CORS policy.
    |
    */

    'paths' => ['*'], // Add login path to the allowed paths

    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, OPTIONS, etc.)

    'allowed_origins' => ['*'], // Allow all origins (or use your frontend domain like 'https://dev.localhost')

    'allowed_headers' => ['*'], // Allow all headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Allow credentials if needed (cookies, auth headers)
];
