<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasTimestamps;
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
    ];
}
