<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreXMLRequest;
use App\Models\Participant;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class XMLController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('xml/index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreXMLRequest $request)
    {
        $xml = simplexml_load_string($request->validated()['xmlData']);

        foreach ($xml->children() as $player) {
            // Check if school exists
            $schoolname = $player->schoolnaam;

            $school = School::where('name', $schoolname)->first();
            if (is_null($school)) {
                // Return redirect with error
                return redirect()->route('xml.create')->with('error', 'School ' . $schoolname . ' not found');
            } 
            
            // Check if player exists
            $participant = Participant::where('name', $player->spelervoornaam)
                ->where('lastname', $player->spelertussenvoegsels ? '' . $player->spelerachternaam : '')
                ->where('school_id', $school->id)
                ->first();

            if (!is_null($participant)) {
                // Skip player
                continue;
            }

            // Create participant
            $participant = Participant::create([
                'name' => $player->spelervoornaam,
                'lastname' => $player->spelertussenvoegsels ? '' . $player->spelerachternaam : '',	
                'school_id' => $school->id,
            ]);

            $participant->save();
        }   

        // Return redirect with success
        return redirect()->route('xml.create')->with('success', true);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
