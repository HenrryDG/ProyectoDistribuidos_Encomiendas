import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Configuración" />

            <h1 className="sr-only">Configuración de Perfil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Configuración de Perfil"
                    description="Actualiza tu información de perfil y dirección de correo electrónico."
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre</Label>

                                <Input
                                    id="nombre"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.nombre}
                                    name="nombre"
                                    required
                                    autoComplete="nombre"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.nombre}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="apellido">Apellido</Label>

                                <Input
                                    id="apellido"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.apellido}
                                    name="apellido"
                                    required
                                    autoComplete="apellido"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.apellido}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="telefono">Teléfono</Label>

                                <Input
                                    id="telefono"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.telefono}
                                    name="telefono"
                                    required
                                    autoComplete="telefono"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.telefono}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="direccion@ejemplo.com"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been
                                                    sent to your email address.
                                                </div>
                                            )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4 ">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className='cursor-pointer'
                                >
                                    Guardar
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Configuración de Perfil',
            href: edit(),
        },
    ],
};
