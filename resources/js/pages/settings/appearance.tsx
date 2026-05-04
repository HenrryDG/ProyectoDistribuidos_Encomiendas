import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Configuración de Apariencia" />

            <h1 className="sr-only">Configuración de Apariencia</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Configuración de Apariencia"
                    description="Actualiza tus preferencias de apariencia, incluyendo el tema y el modo oscuro."
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Configuración de Apariencia',
            href: editAppearance(),
        },
    ],
};
