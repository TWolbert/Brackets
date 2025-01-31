<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateParticipantRequest;
use App\Models\Participant;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $participants = Participant::all();
        // Load school relation on all
        $participants->load("school");
        return Inertia::render("participant/index", [
            "participants"=> $participants
        ]);
    }

    public function create()
    {
        return Inertia::render("participant/create", [
            'schools' => School::all(),
        ]);
    }

    public function store(CreateParticipantRequest $request)
    {
        Participant::create($request->validated());
        return redirect(route("participant.index"))->with("success",true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Participant $participant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Participant $participant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Participant $participant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant)
    {
        //
    }
}
