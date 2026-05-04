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
        Schema::create('seguimiento', function (Blueprint $table) {
            $table->id();

            // Encomienda relacionada
            $table->foreignId('encomienda_id')
                ->constrained('encomiendas')
                ->onDelete('cascade');

            // Estado en ese momento
            $table->foreignId('estado_id')
                ->constrained('estados_encomienda');

            // Usuario que realizó el cambio
            $table->foreignId('usuario_id')
                ->constrained('users');

            // Ubicación (para mapa)
            $table->decimal('latitud', 10, 7)->nullable();
            $table->decimal('longitud', 10, 7)->nullable();

            // Evento descriptivo
            $table->string('evento');

            $table->text('observacion')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seguimiento');
    }
};
