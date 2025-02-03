<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentMatch extends Model
{
    protected $fillable = [
        'tournament_id',
        'winner_id',
    ];

    public function match_participants() {
        return $this->hasMany(MatchParticipant::class, 'tournament_match_id');
    }
}
