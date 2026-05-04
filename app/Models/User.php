<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;


class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Campos permitidos para asignación masiva
     */
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'password',
        'telefono',
        'carnet_identidad',
        'direccion',
        'rol',
        'estado',
    ];

    /**
     * Campos ocultos en respuestas JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Casts automáticos
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'estado' => 'boolean',
        ];
    }

    /* =========================================================
        RELACIONES
    ========================================================= */

    // Remitente -> encomiendas
    public function encomiendas()
    {
        return $this->hasMany(Encomienda::class, 'remitente_id');
    }

    // Usuario -> tracking (eventos que registra)
    public function seguimiento()
    {
        return $this->hasMany(Seguimiento::class, 'usuario_id');
    }

    // Usuario -> notificaciones
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'user_id');
    }

    // Usuario -> entregas (encargado que valida)
    public function entregas()
    {
        return $this->hasMany(Entrega::class, 'usuario_id');
    }

    /* =========================
        HELPERS DE ROLES
    ========================= */

    public function isAdmin()
    {
        return $this->rol === 'admin';
    }

    public function isEncargado()
    {
        return $this->rol === 'encargado';
    }

    public function isRemitente()
    {
        return $this->rol === 'remitente';
    }
}
