<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoundRequest;
use App\Http\Requests\TournamentCreateRequest;
use App\Models\MatchParticipant;
use App\Models\Participant;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\TournamentWinner;
use DB;
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
    // export interface TournamentRoundResults {
    //     id: number;
    //     score1: number;
    //     score2: number;
    // }
    public function saveRound(StoreRoundRequest $request)
    {
        DB::transaction(function () use ($request) {
            $tournament = Tournament::findOrFail($request->validated('tournament_id'));

            if ($tournament->host_id != Auth::id()) {
                abort(403, 'You are not authorized to perform this action.');
            }

            $winners = [];

            $results = $request->validated('results');

            foreach ($results as $result) {
                $match = TournamentMatch::where('id', $result['id'])->first();
                $participants = $match->match_participants;

                if ($participants->count() === 2) {
                    $participants[0]->participant_score = $result['score1'];
                    $participants[0]->save();

                    $participants[1]->participant_score = $result['score2'];
                    $participants[1]->save();

                    $winner_id = -1;

                    if ($result['score1'] > $result['score2']) {
                        $winner_id = $participants[0]->participant_id;
                    } else if ($result['score1'] < $result['score2']) {
                        $winner_id = $participants[1]->participant_id;
                    }

                    $winners = [...$winners, $winner_id];

                    $match->winner_id = $winner_id;
                    $match->save();
                } else {
                    $participants[0]->participant_score = $result['score1'];
                    $participants[0]->save();

                    $match->winner_id = $participants[0]->participant_id;
                    $match->save();

                    $winners = [...$winners, $participants[0]->participant_id];
                }
            }

            $newParticipants = Participant::whereIn('id', $winners)->get();

            if ($newParticipants->count() > 1) {
                // Extract the IDs from the Participant models
                $participantIds = $newParticipants->pluck('id')->toArray();
                shuffle($participantIds);

                $participantCount = count($participantIds);
                // Calculate the next power of two to determine if we need to add byes
                $nextPowerOfTwo = pow(2, ceil(log($participantCount, 2)));
                $numberOfByes = $nextPowerOfTwo - $participantCount;

                // Determine participants receiving byes (if any)
                $participantsWithByes = array_splice($participantIds, 0, $numberOfByes);
                $remainingParticipants = $participantIds; // Participants to be paired

                // Pair up the remaining participants into matches
                for ($i = 0; $i < count($remainingParticipants); $i += 2) {
                    $match = TournamentMatch::create([
                        'tournament_id' => $tournament->id,
                    ]);

                    // Add the first participant to the match
                    MatchParticipant::create([
                        'participant_id' => $remainingParticipants[$i],
                        'tournament_match_id' => $match->id,
                        'participant_score' => 0,
                    ]);

                    // Add the second participant if available
                    if (isset($remainingParticipants[$i + 1])) {
                        MatchParticipant::create([
                            'participant_id' => $remainingParticipants[$i + 1],
                            'tournament_match_id' => $match->id,
                            'participant_score' => 0,
                        ]);
                    }
                }

                // Create matches for participants with byes
                foreach ($participantsWithByes as $byeParticipantId) {
                    $match = TournamentMatch::create([
                        'tournament_id' => $tournament->id,
                    ]);

                    MatchParticipant::create([
                        'participant_id' => $byeParticipantId,
                        'tournament_match_id' => $match->id,
                        'participant_score' => 0,
                    ]);
                }
            } else {
                TournamentWinner::create([
                    'tournament_id' => $tournament->id,
                    'participant_id' => $newParticipants[0]->id,
                ]);
            }


            $tournament->round_number += 1;
            $tournament->save();
        });
    }


    /**
     * Display the specified resource.
     */
    public function show(Tournament $tournament)
    {
        $matches = $tournament->tournament_match()->with(relations: 'match_participants.participant')->whereNull('winner_id')->get();
        $winner_id = TournamentWinner::where('tournament_id', $tournament->id)->first();
        $winner = null;
        if ($winner_id) { 
            $winner = Participant::where('id', $winner_id->participant_id)->first();
        }
        return Inertia::render('tournament/show', [
            'tournament' => $tournament,
            'matches' => $matches,
            'won' => $winner
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
