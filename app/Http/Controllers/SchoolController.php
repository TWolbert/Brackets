<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateSchoolRequest;
use App\Http\Requests\doesSchoolExistByNameRequest;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("school/index", [
            "schools" => School::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("school/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateSchoolRequest $request)
    {
        School::create($request->validated());
        return redirect()->route("school.index")->with("success", true);
    }

    /**
     * Display the specified resource.
     */
    public function show(School $school)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(School $school)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, School $school)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(School $school)
    {
        // Check if any students are associated with the school
        if ($school->participants()->count() > 0) {
            // return json with error message
            return response()->json(["error" => "School has students associated with it. Please remove the participants first."], 200);
        }
        $school->delete();
    }

    public function doesSchoolExistByName(doesSchoolExistByNameRequest $request)
    {
        $school = School::where("name", $request->name)->first();
        return response()->json(["exists" => $school !== null]);
    }
}
