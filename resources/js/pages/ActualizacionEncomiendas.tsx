import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PackageCheck } from 'lucide-react';

interface Encomienda {
    id: number;
    codigo_seguimiento: string;
    destinatario_nombre: string;
    destinatario_telefono: string;
    origen: string;
    destino: string;
    estado_actual_id: number;
}

interface PageProps {
    encomiendas: Encomienda[];
    encomiendasAlmacen: Encomienda[];
}

export default function ActualizacionEncomiendas({
    encomiendas,
    encomiendasAlmacen,
}: PageProps) {

    const actualizarEstado = (id: number) => {

        router.put(
            `/encomiendas/${id}/almacen`,
            {},
            {
                onSuccess: () => {
                    console.log('Estado actualizado');
                },
            }
        );
    };

    return (
        <>
            <Head title="Actualización de Encomiendas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        Actualización de Encomiendas
                    </h1>
                </div>

                <Card className="overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-muted/50 border-b">

                            <tr>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Código
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Destinatario
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Teléfono
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Origen
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Destino
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Estado
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Acción
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {encomiendas.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No hay encomiendas pendientes
                                    </td>
                                </tr>

                            ) : (

                                encomiendas.map((encomienda) => (

                                    <tr
                                        key={encomienda.id}
                                        className="border-b hover:bg-muted/50 transition"
                                    >

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.codigo_seguimiento}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.destinatario_nombre}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.destinatario_telefono}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.origen}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.destino}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            Registrada
                                        </td>

                                        <td className="px-6 py-4 text-sm">

                                            <Button
                                                onClick={() =>
                                                    actualizarEstado(encomienda.id)
                                                }
                                                className="gap-2"
                                            >
                                                <PackageCheck className="h-4 w-4" />
                                                Pasar a almacén
                                            </Button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </Card>
                <h2 className="text-2xl font-bold mt-8">
                    Encomiendas en almacén
                </h2>

                <Card className="overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-muted/50 border-b">

                            <tr>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Código
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Destinatario
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Teléfono
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Origen
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Destino
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-medium">
                                    Estado
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {encomiendasAlmacen.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No hay encomiendas en almacén
                                    </td>
                                </tr>

                            ) : (

                                encomiendasAlmacen.map((encomienda) => (

                                    <tr
                                        key={encomienda.id}
                                        className="border-b hover:bg-muted/50 transition"
                                    >

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.codigo_seguimiento}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.destinatario_nombre}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.destinatario_telefono}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.origen}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {encomienda.destino}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                                            En almacén
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </Card>

            </div>
        </>
    );
}

ActualizacionEncomiendas.layout = {
    breadcrumbs: [
        {
            title: 'Actualización de Encomiendas',
            href: '/actualizacion-encomiendas',
        },
    ],
};