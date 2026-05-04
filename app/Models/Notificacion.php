<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';

    protected $fillable = [
        'user_id',
        'encomienda_id',
        'mensaje',
        'tipo',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Usuario que recibe la notificación
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Encomienda relacionada (opcional)
    public function encomienda()
    {
        return $this->belongsTo(Encomienda::class);
    }
}
