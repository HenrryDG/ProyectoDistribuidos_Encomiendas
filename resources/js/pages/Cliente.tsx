import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Plus, Search } from 'lucide-react';

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface EstadoActual {
    id: number;
    nombre: string;
}

interface Encomienda {
    id: number;
    codigo_seguimiento: string;
    origen: string;
    destino: string;
    descripcion: string;
    estado_actual_id: number;
    estado_actual?: EstadoActual;
}

interface Props {
    encomiendas: Encomienda[];
    estados: EstadoActual[];   // viene del controlador: EstadoEncomienda::all()
}

// ─────────────────────────────────────────────
// Colores por nombre de estado (sin cambios)
// ─────────────────────────────────────────────
const obtenerColorEstado = (estado?: string) => {
    switch (estado) {
        case 'Encomienda registrada': return 'bg-gray-200 text-gray-800';
        case 'Pendiente de salida':   return 'bg-yellow-200 text-yellow-800';
        case 'En camino':             return 'bg-blue-200 text-blue-800';
        case 'Llegada a destino':     return 'bg-purple-200 text-purple-800';
        case 'Entregado':             return 'bg-green-200 text-green-800';
        default:                      return 'bg-red-200 text-red-800';
    }
};

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
export default function Cliente({ encomiendas, estados }: Props) {

    // null = "Todos"
    const [filtroId, setFiltroId] = useState<number | null>(null);
    const [busqueda, setBusqueda] = useState('');

    // Conteo por estado_actual_id para los badges numéricos
    const conteo = useMemo(() => {
        const map: Record<number, number> = {};
        encomiendas.forEach((e) => {
            map[e.estado_actual_id] = (map[e.estado_actual_id] ?? 0) + 1;
        });
        return map;
    }, [encomiendas]);

    // ── Filtrado por ID (nunca falla por encoding) + búsqueda ──
    const encomiendasFiltradas = useMemo(() => {
        let lista = encomiendas;

        if (filtroId !== null) {
            lista = lista.filter((e) => e.estado_actual_id === filtroId);
        }

        const q = busqueda.trim().toLowerCase();
        if (q !== '') {
            lista = lista.filter((e) =>
                e.codigo_seguimiento.toLowerCase().includes(q)
            );
        }

        return lista;
    }, [filtroId, busqueda, encomiendas]);

    return (
        <>
            <Head title="Clientes" />

            <div className="flex flex-col gap-6 p-6">

                {/* ── HEADER ── */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mis Encomiendas</h1>
                        <p className="text-muted-foreground">
                            Consulta el estado actual de tus envíos
                        </p>
                    </div>

                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Solicitud
                    </Button>
                </div>

                {/* ── BUSCADOR ── */}
                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por código…"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* ── FILTROS ── */}
                <div className="flex flex-wrap gap-2">

                    {/* Botón "Todos" */}
                    <Button
                        variant={filtroId === null ? 'default' : 'outline'}
                        onClick={() => setFiltroId(null)}
                        className="gap-1.5"
                    >
                        Todos
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {encomiendas.length}
                        </span>
                    </Button>

                    {/* Un botón por cada estado que viene de la BD */}
                    {estados.map((estado) => (
                        <Button
                            key={estado.id}
                            variant={filtroId === estado.id ? 'default' : 'outline'}
                            onClick={() => setFiltroId(estado.id)}
                            className="gap-1.5"
                        >
                            {estado.nombre}
                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                                {conteo[estado.id] ?? 0}
                            </span>
                        </Button>
                    ))}

                </div>

                {/* ── TARJETAS ── */}
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {encomiendasFiltradas.length === 0 ? (

                        <Card className="p-6">
                            <p className="text-muted-foreground">
                                No existen encomiendas para este estado.
                            </p>
                        </Card>

                    ) : (

                        encomiendasFiltradas.map((encomienda) => (

                            <Card
                                key={encomienda.id}
                                className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
                            >
                                {/* Cabecera */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold">
                                            {encomienda.codigo_seguimiento}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Código de seguimiento
                                        </p>
                                    </div>

                                    <div className="rounded-full bg-muted p-2">
                                        <Package className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className="mt-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorEstado(
                                            encomienda.estado_actual?.nombre
                                        )}`}
                                    >
                                        {encomienda.estado_actual?.nombre ?? 'Sin estado'}
                                    </span>
                                </div>

                                {/* Detalles */}
                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="font-semibold">Origen</span>
                                        <span>{encomienda.origen}</span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="font-semibold">Destino</span>
                                        <span>{encomienda.destino}</span>
                                    </div>

                                    <div className="border-t pt-3">
                                        <p className="mb-1 font-semibold">Descripción</p>
                                        <p className="text-muted-foreground">
                                            {encomienda.descripcion || 'Sin descripción'}
                                        </p>
                                    </div>
                                </div>

                            </Card>

                        ))
                    )}

                </div>

            </div>
        </>
    );
}
