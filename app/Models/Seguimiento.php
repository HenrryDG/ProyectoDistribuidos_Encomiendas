<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seguimiento extends Model
{
    use HasFactory;

    protected $table = 'seguimiento';

    protected $fillable = [
        'encomienda_id',
        'estado_id',
        'usuario_id',
        'latitud',
        'longitud',
        'evento',
        'observacion',
    ];

    /* =========================
        CASTS
    ========================= */

    protected $casts = [
        'latitud' => 'float',
        'longitud' => 'float',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Encomienda asociada
    public function encomienda()
    {
        return $this->belongsTo(Encomienda::class);
    }

    // Estado del envío en ese momento
    public function estado()
    {
        return $this->belongsTo(EstadoEncomienda::class, 'estado_id');
    }

    // Usuario que registra el evento (admin o encargado)
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
