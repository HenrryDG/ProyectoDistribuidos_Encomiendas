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
        if (Schema::hasColumn('encomiendas', 'es_fragil')) {
            Schema::table('encomiendas', function (Blueprint $table) {
                $table->dropColumn('es_fragil');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('encomiendas', 'es_fragil')) {
            Schema::table('encomiendas', function (Blueprint $table) {
                $table->boolean('es_fragil')->default(false);
            });
        }
    }
};
