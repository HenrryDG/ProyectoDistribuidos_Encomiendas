<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('encomiendas', function (Blueprint $table) {
            $table->id();

            // Código único de seguimiento
            $table->string('codigo_seguimiento')->unique();

            // Remitente (usuario)
            $table->foreignId('remitente_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Destinatario
            $table->string('destinatario_nombre');
            $table->string('destinatario_documento');
            $table->string('destinatario_telefono');

            // Origen y destino
            $table->string('origen');
            $table->string('destino');

            // Detalles del paquete
            $table->text('descripcion')->nullable();
            $table->boolean('es_fragil')->default(false);

            // Relaciones operativas
            $table->foreignId('estado_actual_id')
                ->constrained('estados_encomienda');

            $table->foreignId('bus_id')
                ->nullable()
                ->constrained('buses');

            $table->foreignId('ruta_id')
                ->nullable()
                ->constrained('rutas');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encomiendas');
    }
};
