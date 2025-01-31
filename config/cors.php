<?php

return [
    'paths' => ['*'], // Make sure 'login' is included
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://dev.localhost'], // OR ['https://dev.localhost']
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 86400,
    'supports_credentials' => true,
];
