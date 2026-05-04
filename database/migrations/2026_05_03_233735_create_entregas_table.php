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
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();

            // Encomienda entregada
            $table->foreignId('encomienda_id')
                ->constrained('encomiendas')
                ->onDelete('cascade');

            // Datos del receptor
            $table->string('receptor_nombre');
            $table->string('receptor_documento');

            // Evidencias de entrega
            $table->string('firma_url')->nullable();
            $table->string('foto_url')->nullable();

            // Fecha de entrega
            $table->dateTime('fecha_entrega');

            // Usuario que valida la entrega (encargado)
            $table->foreignId('usuario_id')
                ->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregas');
    }
};
