<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateMatchParticipantRequest;
use App\Models\MatchParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatchParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("matchparticipant/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateMatchParticipantRequest $request)
    {
        $participant = MatchParticipant::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(MatchParticipant $matchParticipant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MatchParticipant $matchParticipant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MatchParticipant $matchParticipant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MatchParticipant $matchParticipant)
    {
        //
    }
}
