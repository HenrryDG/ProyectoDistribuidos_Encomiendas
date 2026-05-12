<?php

namespace App\Http\Controllers;

use App\Models\Encomienda;
use App\Models\EstadoEncomienda;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function index(): Response
    {
        $encomiendas = Encomienda::with([
            'estadoActual'
        ])
        ->select(
            'id',
            'codigo_seguimiento',
            'origen',
            'destino',
            'descripcion',
            'estado_actual_id'
        )
        ->latest()
        ->get();

        return Inertia::render('Cliente', [
            'encomiendas' => $encomiendas,
            'estados' => EstadoEncomienda::all(),
        ]);
    }
}