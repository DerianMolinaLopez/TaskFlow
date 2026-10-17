# TaskFlow

API REST para la gestión de tareas y proyectos, desarrollada con ASP.NET Core y PostgreSQL. El proyecto forma parte de mi portafolio de desarrollo de software y tiene como objetivo poner en práctica principios de arquitectura por capas, diseño orientado al dominio, autenticación y persistencia de datos.

## Características

### Autenticación y seguridad

- Autenticación mediante JSON Web Tokens (JWT).
- Endpoints protegidos mediante autorización.
- Separación de los recursos por usuario autenticado.
- Validación de la propiedad de tareas y proyectos.

### Gestión de tareas

- Crear, consultar, actualizar y eliminar tareas.
- Asignar prioridades y estados.
- Definir fechas de vencimiento.
- Asociar tareas con proyectos.
- Buscar tareas por título.
- Filtrar por estado y prioridad.
- Ordenar resultados por diferentes campos.
- Paginar los resultados.

### Gestión de proyectos

- Crear, consultar, actualizar y eliminar proyectos.
- Asociar tareas a proyectos.
- Consultar las tareas de un proyecto.
- Validar que los proyectos pertenezcan al usuario autenticado.

### Documentación de la API

- Exploración y prueba de endpoints mediante Scalar.

## Tecnologías

- **C#**
- **ASP.NET Core 10**
- **Entity Framework Core 10**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **Scalar**
- **LINQ**
- **Arquitectura por capas**

## Arquitectura

La solución está organizada en los siguientes proyectos:

```text
TaskFlow/
├── Services.Api/
│   └── Controladores, endpoints y configuración de la API
├── Services.Application/
│   └── Casos de uso, servicios, DTOs e interfaces
├── Services.Domain/
│   └── Entidades, enumeraciones y objetos de valor
└── Services.Infrastructure/
    └── Persistencia, Entity Framework Core y repositorios
```

### Responsabilidades por capa

- **Services.Api:** expone los endpoints HTTP, gestiona las solicitudes y aplica autenticación y autorización.
- **Services.Application:** implementa los casos de uso y coordina las operaciones de la aplicación.
- **Services.Domain:** contiene las reglas de negocio, entidades y objetos de valor.
- **Services.Infrastructure:** implementa el acceso a datos y la integración con PostgreSQL mediante Entity Framework Core.

Esta separación busca mantener las reglas de negocio independientes de los detalles de infraestructura y facilitar el mantenimiento y las pruebas.

## Requisitos previos

Para ejecutar el proyecto necesitas:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- PostgreSQL
- Una base de datos para TaskFlow
- Un editor compatible con .NET, como Visual Studio o Visual Studio Code

## Configuración

1. Clona el repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <DIRECTORIO_DEL_PROYECTO>
   ```

2. Configura la cadena de conexión de PostgreSQL y los parámetros de autenticación JWT según la configuración de `Services.Api`.

   No guardes claves JWT ni contraseñas reales directamente en el repositorio. Utiliza User Secrets o variables de entorno para los valores sensibles.

3. Verifica que las herramientas de Entity Framework Core estén instaladas:

   ```bash
   dotnet tool install --global dotnet-ef
   ```

   Si ya están instaladas, comprueba su versión con:

   ```bash
   dotnet ef --version
   ```

## Base de datos y migraciones

Desde el directorio que contiene la solución, revisa la configuración de Entity Framework Core y ejecuta las migraciones pendientes.

Ejemplo, suponiendo que `Services.Infrastructure` contiene el `DbContext` y las migraciones, y que `Services.Api` es el proyecto de inicio:

```bash
dotnet ef database update \
  --project Services.Infrastructure \
  --startup-project Services.Api
```

Si todavía no existen migraciones, puedes crear la primera con:

```bash
dotnet ef migrations add InitialCreate \
  --project Services.Infrastructure \
  --startup-project Services.Api
```

> Si las migraciones ya están creadas, no necesitas generar otra migración inicial. Ajusta los comandos si tu `DbContext` o las migraciones están ubicados en otro proyecto.

## Ejecutar la API

Desde el directorio de la solución:

```bash
dotnet restore
dotnet build
dotnet run --project Services.Api
```

Utiliza la URL que muestre la consola al iniciar la aplicación. Si Scalar está habilitado en ese entorno, accede a la ruta configurada para consultar y probar los endpoints.

## Endpoints principales

Los endpoints requieren autenticación, salvo que se indique lo contrario.

| Método | Endpoint                   | Descripción                                    |
| ------ | -------------------------- | ---------------------------------------------- |
| POST   | `/api/tasks`               | Crear una tarea                                |
| GET    | `/api/tasks`               | Consultar tareas con filtros y paginación      |
| GET    | `/api/tasks/me`            | Consultar la identidad del usuario autenticado |
| GET    | `/api/tasks/{id}`          | Obtener una tarea                              |
| PUT    | `/api/tasks/{id}`          | Actualizar una tarea                           |
| DELETE | `/api/tasks/{id}`          | Eliminar una tarea                             |
| POST   | `/api/projects`            | Crear un proyecto                              |
| GET    | `/api/projects`            | Consultar proyectos                            |
| GET    | `/api/projects/{id}`       | Obtener un proyecto                            |
| PUT    | `/api/projects/{id}`       | Actualizar un proyecto                         |
| DELETE | `/api/projects/{id}`       | Eliminar un proyecto                           |
| GET    | `/api/projects/{id}/tasks` | Consultar las tareas de un proyecto            |

La disponibilidad exacta de cada ruta depende de la configuración actual de los controladores.

### Consultas de tareas

El listado de tareas admite paginación y opciones de consulta, incluyendo filtros por estado y prioridad, búsqueda por título y ordenamiento.

Consulta los parámetros definidos en `TaskQueryRequest` para conocer los nombres y valores aceptados por la implementación actual.

## Estado del proyecto

TaskFlow se encuentra en desarrollo incremental. Las funcionalidades implementadas se validan mediante solicitudes a la API.

### Próximas mejoras

- Implementar un resumen del progreso de cada proyecto.
- Incorporar pruebas automatizadas.
- Mejorar la gestión de errores y las respuestas de validación.
- Desarrollar una interfaz frontend para consumir la API.
- Preparar documentación y ejemplos de uso más completos.

## Objetivo

Este proyecto busca demostrar conocimientos prácticos en desarrollo backend con .NET, diseño de APIs REST, persistencia relacional, autenticación JWT, arquitectura por capas y modelado del dominio.

## Autor

Desarrollado por Ing. Jesús Manuel Bañuelos Ibarra.
