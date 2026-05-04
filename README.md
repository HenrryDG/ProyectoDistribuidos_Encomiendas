# 📦 Sistema Web de Monitoreo de Encomiendas

Sistema web desarrollado con **Laravel + React (Inertia + Starter Kit)** para la gestión y trazabilidad de encomiendas en tiempo real, aplicando una arquitectura modular.

---

## 🚀 Tecnologías utilizadas

- Laravel 13
- React + TypeScript
- Inertia.js
- MySQL
- Vite
- TailwindCSS

---

## 📁 Instalación del proyecto

Sigue los siguientes pasos para ejecutar el proyecto en tu entorno local.

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/HenrryDG/ProyectoDistribuidos_Encomiendas.git
cd ProyectoDistribuidos_Encomiendas
```

### 2️⃣ Configurar credenciales de base de datos

Antes de continuar, se debe tener el **servicio de MySQL activo y en ejecución**. y el archivo **.env.example** bien configurados con las credenciales de la base de datos

> ⚠️ **Importante:** Las migraciones se ejecutan automáticamente en el siguiente paso. Si MySQL no está levantado o las credenciales son incorrectas, el proceso fallará.

### 3️⃣ Ejecutar el setup automático

Un solo comando se encarga de preparar todo el entorno:

```bash
composer run setup
```

Este comando ejecuta internamente los siguientes pasos en orden:

| Paso | Comando | Descripción |
|------|---------|-------------|
| 1 | `composer install` | Instala todas las dependencias PHP del proyecto |
| 2 | `copy .env.example .env` | Crea el archivo `.env` si aún no existe |
| 3 | `php artisan key:generate` | Genera la clave de cifrado de la aplicación |
| 4 | `php artisan migrate --force` | Ejecuta las migraciones en la base de datos |
| 5 | `npm install` | Instala las dependencias del frontend (React, Vite, etc.) |
| 6 | `npm run build` | Compila y optimiza los assets del frontend para producción |

### 4️⃣ Ejecutar seeders *(creará un usuario para acceder al sistema)*

```bash
php artisan db:seed
```

### 5️⃣ Iniciar aplicación

```bash
composer run dev
```

El proyecto estará disponible en:

```
http://127.0.0.1:8000
```

---

## 👥 Roles del sistema

| Rol | Descripción |
|-----|-------------|
| 👨‍💼 Administrador | Gestión completa del sistema |
| 📦 Encargado de almacén | Control de encomiendas y almacén |
| 👤 Remitente | Seguimiento de sus envíos |

---

## 📌 Funcionalidades principales

- ✅ Registro de encomiendas
- ✅ Seguimiento en tiempo real
- ✅ Gestión de estados de envío
- ✅ Trazabilidad completa
- ✅ Asignación de rutas
- ✅ Notificaciones de cambios
- ✅ Dashboard administrativo

---

## ⚙️ Notas importantes

- Requiere **MySQL** activo
- **Laravel Sanctum/Fortify** maneja autenticación
- Frontend con **React + Inertia**
- Tener **PHP** y **Node.js** instalados

---

## 🧪 Credenciales por defecto

```
Email:    admin@gmail.com
Password: admin
```
