<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{
    use HasFactory;

    protected $table = 'rutas';

    protected $fillable = [
        'origen',
        'destino',
        'hora_salida',
        'hora_llegada_estimada',
        'estado',
    ];

    protected $casts = [
        'hora_salida' => 'datetime',
        'hora_llegada_estimada' => 'datetime',
        'estado' => 'boolean',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Encomiendas asignadas a esta ruta
    public function encomiendas()
    {
        return $this->belongsToMany(
            Encomienda::class,
            'encomienda_ruta'
        )->withPivot(['bus_id', 'fecha_asignacion']);
    }

    // Buses que operan en esta ruta
    public function buses()
    {
        return $this->belongsToMany(
            Bus::class,
            'encomienda_ruta'
        )->withPivot(['encomienda_id', 'fecha_asignacion']);
    }
}
