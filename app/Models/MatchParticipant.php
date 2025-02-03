<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchParticipant extends Model
{
    protected $fillable = [
        'participant_id',
        'tournament_match_id',
        'participant_score'
    ];

    public function participant() {
        return $this->belongsTo(Participant::class);
    }
}
