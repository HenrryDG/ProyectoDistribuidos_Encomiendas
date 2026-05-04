<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    use HasFactory;
    protected $table = 'buses';

    protected $fillable = [
        'codigo_bus',
        'placa',
        'capacidad',
        'estado',
    ];

    protected $casts = [
        'capacidad' => 'integer',
        'estado' => 'boolean',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Encomiendas asignadas a este bus
    public function encomiendas()
    {
        return $this->hasMany(Encomienda::class);
    }

    // Rutas asociadas al bus (a través de encomiendas o asignaciones)
    public function rutas()
    {
        return $this->belongsToMany(
            Ruta::class,
            'encomienda_ruta'
        )->withPivot(['encomienda_id', 'fecha_asignacion']);
    }
}
