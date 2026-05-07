<?php

use App\Http\Controllers\RemitentesController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('remitentes', [RemitentesController::class, 'index'])->name('remitentes.index');
    Route::post('remitentes', [RemitentesController::class, 'store'])->name('remitentes.store');
    Route::put('remitentes/{remitente}', [RemitentesController::class, 'update'])->name('remitentes.update');
    Route::delete('remitentes/{remitente}', [RemitentesController::class, 'destroy'])->name('remitentes.destroy');
});

require __DIR__.'/settings.php';
