<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\XMLController;
use App\Models\MatchParticipant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect(route('login'));
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/school/exists', [SchoolController::class, 'doesSchoolExistByName'])->name('school.exists');

Route::resource('tournament', TournamentController::class);
Route::resource('participant', ParticipantController::class);
Route::resource('match-participant', MatchParticipant::class);
Route::resource('school', SchoolController::class);
Route::resource('xml', XMLController::class);

require __DIR__.'/auth.php';
