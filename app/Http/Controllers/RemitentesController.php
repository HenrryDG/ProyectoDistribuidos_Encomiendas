<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RemitentesController extends Controller
{
    public function index(): Response
    {
        $remitentes = User::select('id', 'nombre', 'apellido', 'email', 'telefono', 'carnet_identidad', 'direccion')->get();

        return Inertia::render('Remitentes', [
            'remitentes' => $remitentes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'required|string|max:20',
            'carnet_identidad' => 'required|string|unique:users,carnet_identidad',
            'direccion' => 'required|string|max:500',
            'password' => 'required|min:8',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['rol'] = 'remitente';
        $validated['estado'] = 1;

        User::create($validated);

        return redirect()->route('remitentes.index')->with('success', 'Remitente creado exitosamente');
    }

    public function update(Request $request, User $remitente)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$remitente->id,
            'telefono' => 'required|string|max:20',
            'carnet_identidad' => 'required|string|unique:users,carnet_identidad,'.$remitente->id,
            'direccion' => 'required|string|max:500',
        ]);

        $remitente->update($validated);

        return redirect()->route('remitentes.index')->with('success', 'Remitente actualizado exitosamente');
    }

    public function destroy(User $remitente)
    {
        $remitente->delete();

        return redirect()->route('remitentes.index')->with('success', 'Remitente eliminado exitosamente');
    }
}
