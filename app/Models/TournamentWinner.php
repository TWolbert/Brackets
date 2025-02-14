<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentWinner extends Model
{
    protected $fillable = [
        'tournament_id',
        'participant_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
