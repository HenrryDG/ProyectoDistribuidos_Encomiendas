<?php

namespace App\Http\Controllers;

use App\Models\Encomienda;
use App\Models\EstadoEncomienda;
use App\Models\User;
use App\Models\Bus;
use App\Models\DetalleEncomienda; // Modelo del detalle
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Seguimiento;

class EncomiendasController extends Controller
{
    // =====================
    // LISTAR encomiendas
    // =====================
    public function index()
    {
        return Inertia::render('Encomiendas', [
            'encomiendas' => Encomienda::with([
                'remitente',
                'estadoActual',
                'bus',
                'detalle' // Cargar detalle de la encomienda
            ])->latest()->get(),

            'remitentes' => User::select('id', 'nombre', 'apellido')->get(),

            'estados' => EstadoEncomienda::select('id', 'nombre')->get(),

            'buses' => Bus::select('id', 'placa')->get(),
        ]);
    }

    // =====================
    // REGISTRAR encomienda
    // =====================
   public function store(Request $request)
{
    $validated = $request->validate([
        'remitente_id'           => 'required|exists:users,id',
        'destinatario_nombre'    => 'required|string|max:255',
        'destinatario_documento' => 'required|string|max:50',
        'destinatario_telefono'  => 'required|string|max:20',
        'origen'                 => 'required|string|max:100',
        'destino'                => 'required|string|max:100',
        'descripcion'            => 'nullable|string',
        'bus_id'                 => 'nullable|exists:buses,id',

        // Detalle
        'producto'               => 'required|string|max:255',
        'peso'                   => 'required|numeric|min:0',
        'es_fragil'              => 'boolean',
    ]);

    // Generar código único
    $validated['codigo_seguimiento'] =
        strtoupper(Str::random(4)) . '-' . now()->format('YmdHis');

    // Buscar el estado inicial "Recibido"
    $estadoInicial = EstadoEncomienda::where('nombre', 'Recibido')->first();

    // Si no existe, usar el primer estado disponible
    if (!$estadoInicial) {
        $estadoInicial = EstadoEncomienda::first();
    }

    // Asignar el estado obligatorio
    $validated['estado_actual_id'] = $estadoInicial->id;

    // Guardar datos del detalle antes de crear la encomienda
    $producto  = $validated['producto'];
    $peso      = $validated['peso'];
    $esFragil  = $validated['es_fragil'] ?? false;

    // Quitar estos campos porque no pertenecen a la tabla encomiendas
    unset($validated['producto'], $validated['peso'], $validated['es_fragil']);

    // Crear encomienda
    $encomienda = Encomienda::create($validated);

    // Crear detalle
    $encomienda->detalle()->create([
        'producto'   => $producto,
        'peso'       => $peso,
        'es_fragil'  => $esFragil,
    ]);
// Registrar seguimiento inicial
$encomienda->seguimiento()->create([
    'estado_id'   => $estadoInicial->id,
    'usuario_id'  => auth()->id(), // Usuario que registra
    'evento'      => 'Registro de encomienda',
    'descripcion' => 'Encomienda registrada en el sistema.',
    'fecha'       => now(),
]);

   return redirect()
    ->route('encomiendas.index')
    ->with('success', 'Encomienda registrada correctamente.');
}

// =====================
// ACTUALIZAR encomienda
// =====================
    public function update(Request $request, Encomienda $encomienda)
    {
        $validated = $request->validate([
            'destinatario_nombre'    => 'sometimes|string|max:255',
            'destinatario_documento' => 'sometimes|string|max:50',
            'destinatario_telefono'  => 'sometimes|string|max:20',
            'origen'                 => 'sometimes|string|max:100',
            'destino'                => 'sometimes|string|max:100',
            'descripcion'            => 'nullable|string',

            // OJO: tu tabla se llama estados_encomienda (sin "estado_encomiendas")
            'estado_actual_id'       => 1,

            'bus_id'                 => 'nullable|exists:buses,id',

            // Datos del detalle
            'producto'               => 'sometimes|string|max:255',
            'peso'                   => 'sometimes|numeric|min:0',
            'es_fragil'              => 'boolean',
        ]);

        // =========================
        // Separar datos del detalle
        // =========================
        $detalleData = [];

        if (isset($validated['producto'])) {
            $detalleData['producto'] = $validated['producto'];
            unset($validated['producto']);
        }

        if (isset($validated['peso'])) {
            $detalleData['peso'] = $validated['peso'];
            unset($validated['peso']);
        }

        if (array_key_exists('es_fragil', $validated)) {
            $detalleData['es_fragil'] = $validated['es_fragil'];
            unset($validated['es_fragil']);
        }

        // =========================
        // Actualizar encomienda
        // =========================
        $encomienda->update($validated);

        // =========================
        // Actualizar o crear detalle
        // =========================
        if (!empty($detalleData)) {
            $encomienda->detalle()->updateOrCreate(
                ['encomienda_id' => $encomienda->id],
                $detalleData
            );
        }

        
        return redirect()
            ->route('encomiendas.index')
            ->with('success', 'Encomienda actualizada correctamente.');
    }
    // =====================
    // ELIMINAR encomienda
    // =====================
    public function destroy(Encomienda $encomienda)
{
    // Eliminar detalle asociado (si existe)
    $encomienda->detalle()->delete();

    // Eliminar seguimiento asociado
    $encomienda->seguimiento()->delete();

    // Eliminar encomienda
    $encomienda->delete();

    
    return redirect()
        ->route('encomiendas.index')
        ->with('success', 'Encomienda eliminada correctamente.');
}
}