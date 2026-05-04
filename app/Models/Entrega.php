<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrega extends Model
{
    use HasFactory;

    protected $table = 'entregas';

    protected $fillable = [
        'encomienda_id',
        'receptor_nombre',
        'receptor_documento',
        'firma_url',
        'foto_url',
        'fecha_entrega',
        'usuario_id',
    ];

    protected $casts = [
        'fecha_entrega' => 'datetime',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Encomienda entregada
    public function encomienda()
    {
        return $this->belongsTo(Encomienda::class);
    }

    // Usuario encargado que valida la entrega
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
