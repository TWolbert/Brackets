<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchParticipant extends Model
{
    protected $fillable = [
        'participant_id',
        'match_id',
        'participant_score'
    ];
}
