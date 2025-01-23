<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{ 
    use HasTimestamps;

    protected $fillable= [
        'name',
        'lastname',
        'school_id',
        'image_id'
    ];
}
