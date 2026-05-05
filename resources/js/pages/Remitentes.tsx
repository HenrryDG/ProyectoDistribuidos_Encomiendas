import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit2, Plus } from 'lucide-react';
import * as remitentesRoutes from '@/routes/remitentes';

interface Remitente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    carnet_identidad: string;
    direccion: string;
}

interface PageProps {
    remitentes: Remitente[];
}

export default function Remitentes({ remitentes: initialRemitentes }: PageProps) {
    const [remitentes, setRemitentes] = useState<Remitente[]>(initialRemitentes);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        carnet_identidad: '',
        direccion: '',
        password: '',
    });

    const handleOpenDialog = (remitente?: Remitente) => {
        if (remitente) {
            setEditingId(remitente.id);
            setData({
                nombre: remitente.nombre,
                apellido: remitente.apellido,
                email: remitente.email,
                telefono: remitente.telefono,
                carnet_identidad: remitente.carnet_identidad,
                direccion: remitente.direccion,
                password: '',
            });
        } else {
            setEditingId(null);
            reset();
        }
        setIsOpen(true);
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
        setEditingId(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingId) {
            put(remitentesRoutes.update({ id: editingId}).url, {
                onSuccess: () => {
                    handleCloseDialog();
                    // Update local state
                    setRemitentes(
                        remitentes.map((r) =>
                            r.id === editingId ? { ...r, ...data } : r
                        )
                    );
                },
            });
        } else {
            post(remitentesRoutes.index().url, {
                onSuccess: () => {
                    handleCloseDialog();
                    // Add new remitente to local state
                    setRemitentes([
                        ...remitentes,
                        {
                            id: Math.max(...remitentes.map((r) => r.id), 0) + 1,
                            ...data,
                        } as Remitente,
                    ]);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de que desea eliminar este remitente?')) {
            setIsDeleting(id);
            destroy(remitentesRoutes.destroy({ id: id}).url, {
                onSuccess: () => {
                    setRemitentes(remitentes.filter((r) => r.id !== id));
                    setIsDeleting(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Remitentes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Remitentes</h1>
                    <Button onClick={() => handleOpenDialog()} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Remitente
                    </Button>
                </div>

                <Card className="overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium">Nombres</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Apellidos</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Teléfono</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Carnet</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Dirección</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {remitentes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        No hay remitentes registrados
                                    </td>
                                </tr>
                            ) : (
                                remitentes.map((remitente) => (
                                    <tr key={remitente.id} className="border-b hover:bg-muted/50 transition">
                                        <td className="px-6 py-4 text-sm">{remitente.nombre}</td>
                                        <td className="px-6 py-4 text-sm">{remitente.apellido}</td>
                                        <td className="px-6 py-4 text-sm">{remitente.email}</td>
                                        <td className="px-6 py-4 text-sm">{remitente.telefono}</td>
                                        <td className="px-6 py-4 text-sm">{remitente.carnet_identidad}</td>
                                        <td className="px-6 py-4 text-sm">{remitente.direccion}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(remitente)}
                                                    className="gap-1"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(remitente.id)}
                                                    disabled={isDeleting === remitente.id}
                                                    className="gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Editar Remitente' : 'Nuevo Remitente'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Juan"
                                        className={errors.nombre ? 'border-red-500' : ''}
                                    />
                                    {errors.nombre && (
                                        <span className="text-sm text-red-500">{errors.nombre}</span>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input
                                        id="apellido"
                                        value={data.apellido}
                                        onChange={(e) => setData('apellido', e.target.value)}
                                        placeholder="Pérez"
                                        className={errors.apellido ? 'border-red-500' : ''}
                                    />
                                    {errors.apellido && (
                                        <span className="text-sm text-red-500">{errors.apellido}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="juan@example.com"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <span className="text-sm text-red-500">{errors.email}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    placeholder="+591 XXXXXXXXX"
                                    className={errors.telefono ? 'border-red-500' : ''}
                                />
                                {errors.telefono && (
                                    <span className="text-sm text-red-500">{errors.telefono}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="carnet_identidad">Carnet</Label>
                                <Input
                                    id="carnet_identidad"
                                    value={data.carnet_identidad}
                                    onChange={(e) => setData('carnet_identidad', e.target.value)}
                                    placeholder="1234567890"
                                    className={errors.carnet_identidad ? 'border-red-500' : ''}
                                />
                                {errors.carnet_identidad && (
                                    <span className="text-sm text-red-500">{errors.carnet_identidad}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input
                                    id="direccion"
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    placeholder="Calle Principal 123"
                                    className={errors.direccion ? 'border-red-500' : ''}
                                />
                                {errors.direccion && (
                                    <span className="text-sm text-red-500">{errors.direccion}</span>
                                )}
                            </div>

                            {!editingId && (
                                <div>
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-red-500">{errors.password}</span>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 justify-end pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseDialog}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {editingId ? 'Actualizar' : 'Crear'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Remitentes.layout = {
    breadcrumbs: [
        {
            title: 'Remitentes',
            href: remitentesRoutes.index().url,
        },
    ],
};
