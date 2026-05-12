<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleEncomienda extends Model
{
    use HasFactory;

    // Nombre real de la tabla
    protected $table = 'detalles_encomienda';

    // IMPORTANTE:
    // La tabla NO tiene created_at ni updated_at,
    // por lo tanto Laravel no debe intentar insertarlos.
    public $timestamps = false;

    protected $fillable = [
        'encomienda_id',
        'producto',
        'peso',
        'es_fragil',
    ];

    protected $casts = [
        'peso' => 'decimal:2',
        'es_fragil' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELACIONES
    |--------------------------------------------------------------------------
    */

    // Un detalle pertenece a una encomienda
    public function encomienda()
    {
        return $this->belongsTo(Encomienda::class, 'encomienda_id');
    }
}