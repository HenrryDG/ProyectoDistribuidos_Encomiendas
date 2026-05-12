<?php

namespace App\Http\Controllers;

use App\Models\Encomienda;
use Inertia\Inertia;
use Inertia\Response;

class ActualizacionEncomiendasController extends Controller
{
    // MOSTRAR ENCOMIENDAS
    public function index(): Response
    {
        // ESTADO 1 = REGISTRADAS
        $encomiendas = Encomienda::select(
                'id',
                'codigo_seguimiento',
                'destinatario_nombre',
                'destinatario_telefono',
                'origen',
                'destino',
                'estado_actual_id'
            )
            ->where('estado_actual_id', 1)
            ->get();

        // ESTADO 2 = EN ALMACÉN
        $encomiendasAlmacen = Encomienda::select(
                'id',
                'codigo_seguimiento',
                'destinatario_nombre',
                'destinatario_telefono',
                'origen',
                'destino',
                'estado_actual_id'
            )
            ->where('estado_actual_id', 2)
            ->get();

        return Inertia::render('ActualizacionEncomiendas', [
            'encomiendas' => $encomiendas,
            'encomiendasAlmacen' => $encomiendasAlmacen,
        ]);
    }

    // CAMBIAR A ESTADO 2
    public function actualizarEstadoAlmacen(Encomienda $encomienda)
    {
        $encomienda->estado_actual_id = 2;

        $encomienda->save();

        return redirect()
            ->route('ActualizacionEncomiendas.index')
            ->with('success', 'Encomienda enviada a almacén exitosamente');
    }
}