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
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();

            // Usuario que recibe la notificación
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Relación opcional con encomienda
            $table->foreignId('encomienda_id')
                ->nullable()
                ->constrained('encomiendas')
                ->onDelete('cascade');

            // Contenido de la notificación
            $table->string('tipo');
            $table->text('mensaje');

            // Estado de lectura
            $table->boolean('leido')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
