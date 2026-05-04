<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoEncomienda extends Model
{
    use HasFactory;

    protected $table = 'estados_encomienda';

    protected $fillable = [
        'nombre',
        'orden',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Una encomienda puede tener muchos registros de seguimiento con este estado
    public function seguimientos()
    {
        return $this->hasMany(Seguimiento::class, 'estado_id');
    }

    // Encomiendas que actualmente están en este estado
    public function encomiendas()
    {
        return $this->hasMany(Encomienda::class, 'estado_actual_id');
    }
}
