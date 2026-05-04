<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nombre' => 'Juan',
            'apellido' => 'Perez',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'telefono' => '70000000',
            'carnet_identidad' => '1100000',
            'rol' => 'admin',
            'estado' => true,
        ]);
    }
}
