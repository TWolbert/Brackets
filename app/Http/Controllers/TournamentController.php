<?php

namespace App\Http\Controllers;

use App\Http\Requests\TournamentCreateRequest;
use App\Models\MatchParticipant;
use App\Models\Participant;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TournamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("tournament/index", [
            "tournaments" => Tournament::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("tournament/create", [
            "participants" => Participant::all()->load("school"),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TournamentCreateRequest $request)
    {
        $tournament = Tournament::create([
            ...$request->validated(),
            'host_id' => Auth::user()->id,
            'round_number' => 1
        ]);

        $tournamentParticipants = $request->get('tournament_participants');
        shuffle($tournamentParticipants); // Shuffle to randomize matchups

        $tournamentParticipantCount = count($tournamentParticipants);
        $nextPowerOfTwo = pow(2, ceil(log($tournamentParticipantCount, 2)));

        // Add byes
        $numberOfByes = $nextPowerOfTwo - $tournamentParticipantCount;

        // Create matches with byes
        $matches = [];
        $participantsWithByes = array_splice($tournamentParticipants, 0, $numberOfByes);
        $remainingParticipants = $tournamentParticipants;


        // Pair up the remaining participants
        for ($i = 0; $i < count($remainingParticipants); $i += 2) {
            $match = TournamentMatch::create([
                'tournament_id' => $tournament->id,
            ]);
            // Player 1
            $matchParticipant1 = MatchParticipant::create([
                'participant_id' => $remainingParticipants[$i],
                'tournament_match_id' => $match->id,
                'participant_score' => 0,
            ]);

            // Player 2 (if exists)
            if (isset($remainingParticipants[$i + 1])) {
                $matchParticipant2 = MatchParticipant::create([
                    'participant_id' => $remainingParticipants[$i + 1],
                    'tournament_match_id' => $match->id,
                    'participant_score' => 0,
                ]);
            }

            $matches[] = $match;
        }

        foreach ($participantsWithByes as $byeParticipant) {
            $match = TournamentMatch::create([
                'tournament_id' => $tournament->id,
            ]);

            MatchParticipant::create([
                'participant_id' => $byeParticipant,
                'tournament_match_id' => $match->id,
                'participant_score' => 0,
            ]);
        }

        return redirect(route('tournament.index'));
    }


    /**
     * Display the specified resource.
     */
    public function show(Tournament $tournament)
    {
        $matches = $tournament->tournament_match()->with('match_participants.participant')->get();

        return Inertia::render('tournament/show', [
            'tournament' => $tournament,
            'matches' => $matches,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tournament $tournament)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tournament $tournament)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tournament $tournament)
    {
        //
    }
}
