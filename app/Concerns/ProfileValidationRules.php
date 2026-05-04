<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    protected function profileRules(?int $userId = null): array
    {
        return [
            'nombre' => $this->nombreRules(),
            'apellido' => $this->apellidoRules(),
            'email' => $this->emailRules($userId),
            'telefono' => $this->telefonoRules(),
            'direccion' => $this->direccionRules(),
        ];
    }

    protected function nombreRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    protected function apellidoRules(): array
    {
        return ['nullable', 'string', 'max:255'];
    }

    protected function telefonoRules(): array
    {
        return ['nullable', 'string', 'max:20'];
    }

    protected function direccionRules(): array
    {
        return ['nullable', 'string', 'max:255'];
    }

    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
