import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit2, Plus, Package } from 'lucide-react';
import * as encomiendaRoutes from '@/routes/encomiendas';

interface EstadoEncomienda {
    id: number;
    nombre: string;
}

interface Bus {
    id: number;
    placa: string;
}

interface Remitente {
    id: number;
    nombre: string;
    apellido: string;
}

interface DetalleEncomienda {
    producto: string;
    peso: number;
    es_fragil: boolean;
}

interface Encomienda {
    id: number;
    codigo_seguimiento: string;
    remitente_id: number;
    destinatario_nombre: string;
    destinatario_documento: string;
    destinatario_telefono: string;
    origen: string;
    destino: string;
    descripcion: string;
    es_fragil: boolean;
    estado_actual_id: number;
    bus_id: number | null;

    remitente?: Remitente;
    estado_actual?: EstadoEncomienda;
    detalle?: DetalleEncomienda;
}

interface PageProps {
    encomiendas: Encomienda[];
    remitentes: Remitente[];
    estados: EstadoEncomienda[];
    buses: Bus[];
}

export default function Encomiendas({
    encomiendas: initialEncomiendas,
    remitentes,
    estados,
    buses,
}: PageProps) {
    const [encomiendas, setEncomiendas] = useState<Encomienda[]>(initialEncomiendas);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
        remitente_id: '',
        destinatario_nombre: '',
        destinatario_documento: '',
        destinatario_telefono: '',
        origen: '',
        destino: '',
        descripcion: '',
        es_fragil: false,
        producto: '',
        peso: '',
        estado_actual_id: '',
        bus_id: '',
    });
   // Reemplaza COMPLETAMENTE tu función handleOpenDialog por esta versión corregida

const handleOpenDialog = (encomienda?: Encomienda) => {
    if (encomienda) {
        setEditingId(encomienda.id);

        setData({
            remitente_id: String(encomienda.remitente_id),
            destinatario_nombre: encomienda.destinatario_nombre ?? '',
            destinatario_documento: encomienda.destinatario_documento ?? '',
            destinatario_telefono: encomienda.destinatario_telefono ?? '',
            origen: encomienda.origen ?? '',
            destino: encomienda.destino ?? '',
            descripcion: encomienda.descripcion ?? '',

            // Datos del detalle de encomienda
            producto: encomienda.detalle?.producto ?? '',
            peso:
                encomienda.detalle?.peso !== undefined &&
                encomienda.detalle?.peso !== null
                    ? String(encomienda.detalle.peso)
                    : '',

            // El campo es_fragil ahora se obtiene desde detalles_encomienda
            es_fragil: encomienda.detalle?.es_fragil ?? false,

            estado_actual_id:
                encomienda.estado_actual_id !== undefined &&
                encomienda.estado_actual_id !== null
                    ? String(encomienda.estado_actual_id)
                    : '',

            bus_id:
                encomienda.bus_id !== undefined &&
                encomienda.bus_id !== null
                    ? String(encomienda.bus_id)
                    : '',
        });
    } else {
        // Nuevo registro
        setEditingId(null);

        setData({
            remitente_id: '',
            destinatario_nombre: '',
            destinatario_documento: '',
            destinatario_telefono: '',
            origen: '',
            destino: '',
            descripcion: '',

            // Detalle
            producto: '',
            peso: '',
            es_fragil: false,

            estado_actual_id: '',
            bus_id: '',
        });
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
        put(encomiendaRoutes.update({ id: editingId }).url, {
            preserveScroll: true,
            onSuccess: () => {
                // Buscar los nombres actualizados para mostrar en la tabla
                const remitenteSeleccionado = remitentes.find(
                    (r) => r.id === Number(data.remitente_id)
                );

                const estadoSeleccionado = estados.find(
                    (e) => e.id === Number(data.estado_actual_id)
                );

                // Actualizar el estado local incluyendo las relaciones
                setEncomiendas(
                    encomiendas.map((enc) =>
                        enc.id === editingId
                            ? {
                                  ...enc,
                                  ...data,

                                  // Convertir tipos
                                  remitente_id: Number(data.remitente_id),
                                  estado_actual_id: Number(data.estado_actual_id),
                                  bus_id: data.bus_id
                                      ? Number(data.bus_id)
                                      : null,

                                  // Actualizar relaciones para que se reflejen en la tabla
                                  remitente: remitenteSeleccionado,
                                  estado_actual: estadoSeleccionado,

                                  // Actualizar detalle
                                  detalle: {
                                      producto: data.producto,
                                      peso: Number(data.peso),
                                      es_fragil: data.es_fragil,
                                  },
                              }
                            : enc
                    )
                );

                handleCloseDialog();
            },
        });
    } else {
        post(encomiendaRoutes.index().url, {
            preserveScroll: true,
            onSuccess: () => {
                // Recargar la página para obtener la nueva encomienda
                window.location.reload();
            },
        });
    }
};

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de que desea eliminar esta encomienda?')) {
            setIsDeleting(id);
            destroy(encomiendaRoutes.destroy({ id }).url, {
                onSuccess: () => {
                    setEncomiendas(encomiendas.filter((enc) => enc.id !== id));
                    setIsDeleting(null);
                },
            });
        }
    };

    const badgeEstado = (nombre?: string) => {
        const map: Record<string, string> = {
            Recibido: 'bg-blue-100 text-blue-800',
            'En tránsito': 'bg-yellow-100 text-yellow-800',
            Entregado: 'bg-green-100 text-green-800',
        };
        return map[nombre ?? ''] ?? 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title="Encomiendas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Encomiendas</h1>
                    <Button onClick={() => handleOpenDialog()} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Encomienda
                    </Button>
                </div>

                {/* Tabla */}
                <Card className="overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium">Código</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Remitente</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Destinatario</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Origen → Destino</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Frágil</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encomiendas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                                        <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                        No hay encomiendas registradas
                                    </td>
                                </tr>
                            ) : (
                                encomiendas.map((enc) => (
                                    <tr key={enc.id} className="border-b hover:bg-muted/50 transition">
                                        <td className="px-6 py-4 text-sm font-mono font-semibold">
                                            {enc.codigo_seguimiento}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {enc.remitente
                                                ? `${enc.remitente.nombre} ${enc.remitente.apellido}`
                                                : enc.remitente_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium">{enc.destinatario_nombre}</div>
                                            <div className="text-muted-foreground text-xs">{enc.destinatario_telefono}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {enc.origen} → {enc.destino}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badgeEstado(enc.estado_actual?.nombre)}`}>
                                                {enc.estado_actual?.nombre ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {enc.detalle?.es_fragil ? (
                                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Frágil
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(enc)}
                                                    className="gap-1"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(enc.id)}
                                                    disabled={isDeleting === enc.id}
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

                {/* Modal */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Editar Encomienda' : 'Nueva Encomienda'}
                            </DialogTitle>

                            <DialogDescription>
                                {editingId
                                    ? 'Modifique los datos de la encomienda seleccionada.'
                                    : 'Complete el formulario para registrar una nueva encomienda.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">

                                {/* Remitente */}
                                <div className="col-span-2">
                                    <Label htmlFor="remitente_id">Remitente</Label>
                                    <select
                                        id="remitente_id"
                                        value={data.remitente_id}
                                        onChange={(e) => setData('remitente_id', e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.remitente_id ? 'border-red-500' : 'border-input'}`}
                                    >
                                        <option value="">Seleccionar remitente...</option>
                                        {remitentes.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.nombre} {r.apellido}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.remitente_id && (
                                        <span className="text-sm text-red-500">{errors.remitente_id}</span>
                                    )}
                                </div>

                                {/* Destinatario nombre */}
                                <div>
                                    <Label htmlFor="destinatario_nombre">Nombre destinatario</Label>
                                    <Input
                                        id="destinatario_nombre"
                                        value={data.destinatario_nombre}
                                        onChange={(e) => setData('destinatario_nombre', e.target.value)}
                                        placeholder="Juan Pérez"
                                        className={errors.destinatario_nombre ? 'border-red-500' : ''}
                                    />
                                    {errors.destinatario_nombre && (
                                        <span className="text-sm text-red-500">{errors.destinatario_nombre}</span>
                                    )}
                                </div>

                                {/* Destinatario documento */}
                                <div>
                                    <Label htmlFor="destinatario_documento">Documento destinatario</Label>
                                    <Input
                                        id="destinatario_documento"
                                        value={data.destinatario_documento}
                                        onChange={(e) => setData('destinatario_documento', e.target.value)}
                                        placeholder="CI o pasaporte"
                                        className={errors.destinatario_documento ? 'border-red-500' : ''}
                                    />
                                    {errors.destinatario_documento && (
                                        <span className="text-sm text-red-500">{errors.destinatario_documento}</span>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <Label htmlFor="destinatario_telefono">Teléfono destinatario</Label>
                                    <Input
                                        id="destinatario_telefono"
                                        value={data.destinatario_telefono}
                                        onChange={(e) => setData('destinatario_telefono', e.target.value)}
                                        placeholder="+591 70000000"
                                        className={errors.destinatario_telefono ? 'border-red-500' : ''}
                                    />
                                    {errors.destinatario_telefono && (
                                        <span className="text-sm text-red-500">{errors.destinatario_telefono}</span>
                                    )}
                                </div>

                                {/* Bus */}
                                <div>
                                    <Label htmlFor="bus_id">Bus asignado</Label>
                                    <select
                                        id="bus_id"
                                        value={data.bus_id}
                                        onChange={(e) => setData('bus_id', e.target.value)}
                                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                                    >
                                        <option value="">Sin bus (opcional)</option>
                                        {buses.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.placa}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Origen */}
                                <div>
                                    <Label htmlFor="origen">Origen</Label>
                                    <Input
                                        id="origen"
                                        value={data.origen}
                                        onChange={(e) => setData('origen', e.target.value)}
                                        placeholder="La Paz"
                                        className={errors.origen ? 'border-red-500' : ''}
                                    />
                                    {errors.origen && (
                                        <span className="text-sm text-red-500">{errors.origen}</span>
                                    )}
                                </div>

                                {/* Destino */}
                                <div>
                                    <Label htmlFor="destino">Destino</Label>
                                    <Input
                                        id="destino"
                                        value={data.destino}
                                        onChange={(e) => setData('destino', e.target.value)}
                                        placeholder="Santa Cruz"
                                        className={errors.destino ? 'border-red-500' : ''}
                                    />
                                    {errors.destino && (
                                        <span className="text-sm text-red-500">{errors.destino}</span>
                                    )}
                                </div>

                                {/* Estado 
                                <div className="col-span-2">
                                    <Label htmlFor="estado_actual_id">Estado</Label>
                                    <select
                                        id="estado_actual_id"
                                        value={data.estado_actual_id}
                                        onChange={(e) => setData('estado_actual_id', e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.estado_actual_id ? 'border-red-500' : 'border-input'}`}
                                    >
                                        <option value="">Seleccionar estado...</option>
                                        {estados.map((est) => (
                                            <option key={est.id} value={est.id}>
                                                {est.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.estado_actual_id && (
                                        <span className="text-sm text-red-500">{errors.estado_actual_id}</span>
                                    )}
                                </div>*/}
                                {/* Producto */}
                                    <div>
                                        <Label htmlFor="producto">Producto</Label>
                                        <Input
                                            id="producto"
                                            value={data.producto}
                                            onChange={(e) => setData('producto', e.target.value)}
                                            placeholder="Ej. Televisor, Laptop, Vajilla"
                                            className={errors.producto ? 'border-red-500' : ''}
                                        />
                                        {errors.producto && (
                                            <span className="text-sm text-red-500">{errors.producto}</span>
                                        )}
                                    </div>

                                    {/* Peso */}
                                    <div>
                                        <Label htmlFor="peso">Peso (kg)</Label>
                                        <Input
                                            id="peso"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.peso}
                                            onChange={(e) => setData('peso', e.target.value)}
                                            placeholder="0.00"
                                            className={errors.peso ? 'border-red-500' : ''}
                                        />
                                        {errors.peso && (
                                            <span className="text-sm text-red-500">{errors.peso}</span>
                                        )}
                                    </div>

                                {/* Descripción */}
                                <div className="col-span-2">
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        placeholder="Descripción del contenido..."
                                        rows={3}
                                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background resize-none"
                                    />
                                </div>

                                {/* Frágil */}
                                <div className="col-span-2 flex items-center gap-2">
                                    <Checkbox
                                        id="es_fragil"
                                        checked={data.es_fragil}
                                        onCheckedChange={(checked) =>
                                            setData('es_fragil', checked === true)
                                        }
                                    />
                                    <Label htmlFor="es_fragil" className="cursor-pointer">
                                        Mercancía frágil
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
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

Encomiendas.layout = {
    breadcrumbs: [
        {
            title: 'Encomiendas',
            href: encomiendaRoutes.index().url,
        },
    ],
};