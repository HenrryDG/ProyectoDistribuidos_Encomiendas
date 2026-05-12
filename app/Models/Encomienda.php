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
        'estado_actual_id',
        'bus_id',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELACIONES
    |--------------------------------------------------------------------------
    */

    // Usuario que envía la encomienda
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

    // Detalle de la encomienda (producto, peso, es_fragil)
    public function detalle()
    {
        return $this->hasOne(DetalleEncomienda::class, 'encomienda_id');
    }

    // Historial de seguimiento
    public function seguimiento()
    {
        return $this->hasMany(Seguimiento::class);
    }

    // Entrega final
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
        )->withPivot([
            'bus_id',
            'fecha_asignacion',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTODOS AUXILIARES
    |--------------------------------------------------------------------------
    */

    // Último seguimiento registrado
    public function ultimoSeguimiento()
    {
        return $this->hasOne(Seguimiento::class)->latestOfMany();
    }

    // Accesor para obtener si es frágil desde la tabla detalles_encomienda
    public function getEsFragilAttribute()
    {
        return $this->detalle?->es_fragil ?? false;
    }

    // Accesor para obtener el producto desde la tabla detalles_encomienda
    public function getProductoAttribute()
    {
        return $this->detalle?->producto;
    }

    // Accesor para obtener el peso desde la tabla detalles_encomienda
    public function getPesoAttribute()
    {
        return $this->detalle?->peso;
    }
}