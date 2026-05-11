<?php

use App\Http\Controllers\RemitentesController;
use App\Http\Controllers\ActualizacionEncomiendasController;
use App\Http\Controllers\EncomiendasController;
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
    //Actualizacion de estado de encomiendas almacen
    Route::get('Almacen/encomiendas', [ActualizacionEncomiendasController::class, 'index'])->name('ActualizacionEncomiendas.index');
    Route::put(
        'encomiendas/{encomienda}/almacen',
        [ActualizacionEncomiendasController::class, 'actualizarEstadoAlmacen']
    )->name('ActualizacionEncomiendas.actualizarEstadoAlmacen');});
    //rutas de encomiendas
    Route::get('encomiendas', [EncomiendasController::class, 'index'])->name('encomiendas.index');
    Route::post('encomiendas', [EncomiendasController::class, 'store'])->name('encomiendas.store');
    Route::put('encomiendas/{encomienda}', [EncomiendasController::class, 'update'])->name('encomiendas.update');
    Route::delete('encomiendas/{encomienda}', [EncomiendasController::class, 'destroy'])->name('encomiendas.destroy');

require __DIR__.'/settings.php';
