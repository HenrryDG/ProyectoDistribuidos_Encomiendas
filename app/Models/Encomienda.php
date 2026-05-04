<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encomienda extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo_seguimiento',
        'remitente_id',
        'destinatario_nombre',
        'destinatario_documento',
        'destinatario_telefono',
        'origen',
        'destino',
        'descripcion',
        'es_fragil',
        'estado_actual_id',
        'bus_id',
    ];

    protected $casts = [
        'es_fragil' => 'boolean',
    ];

    /* =========================
        RELACIONES
    ========================= */

    // Remitente (usuario que envía la encomienda)
    public function remitente()
    {
        return $this->belongsTo(User::class, 'remitente_id');
    }

    // Estado actual de la encomienda
    public function estadoActual()
    {
        return $this->belongsTo(EstadoEncomienda::class, 'estado_actual_id');
    }

    // Bus asignado
    public function bus()
    {
        return $this->belongsTo(Bus::class, 'bus_id');
    }

    // Historial de seguimiento (trazabilidad)
    public function seguimiento()
    {
        return $this->hasMany(Seguimiento::class);
    }

    // Entrega final de la encomienda
    public function entrega()
    {
        return $this->hasOne(Entrega::class);
    }

    // Relación con rutas
    public function rutas()
    {
        return $this->belongsToMany(
            Ruta::class,
            'encomienda_ruta'
        )->withPivot(['bus_id', 'fecha_asignacion']);
    }

    /* =========================
        LÓGICA AUXILIAR
    ========================= */

    public function ultimoSeguimiento()
    {
        return $this->hasOne(Seguimiento::class)->latestOfMany();
    }
}
