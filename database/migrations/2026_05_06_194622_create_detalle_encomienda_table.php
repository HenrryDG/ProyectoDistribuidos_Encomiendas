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
        Schema::create('detalles_encomienda', function (Blueprint $table) {
            $table->id();

            // Relación con encomienda
            $table->foreignId('encomienda_id')
                ->constrained('encomiendas')
                ->onDelete('cascade');

            // Productos
            $table->string('producto');
            $table->decimal('peso', 10, 2);
            $table->boolean('es_fragil')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_encomienda');
    }
};
