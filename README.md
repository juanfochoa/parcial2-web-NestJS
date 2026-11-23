# parcial2-web-NestJS

### Explicación de lo que se hizo en el parcial


### Caso 1: atributos no permitidos al crear una tarea

**Cambios.**
- Se instalaron `class-validator` y `class-transformer`.
- Se creó `src/tasks/dto/create-task.dto.ts` (`CreateTaskDto`), que solo admite `title`, `description`, `completed` y `userId`, cada uno con su validación.
- En `src/main.ts` se registró un `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted` y `transform`.
- En `src/tasks/schemas/task.schema.ts` se cambió `strict: false` por `strict: true`.

**Resultado.** Una petición con propiedades extra responde **400 Bad Request** e indica qué campo no está permitido. Si algún dato extra llegara a pasar la validación, Mongoose lo descartaría antes de guardar.

### Caso 2: acceso directo al modelo de usuarios desde el módulo de tareas

**Cambios.**
- `src/users/users.module.ts` ahora exporta `UsersService` (`exports: [UsersService]`).
- `src/tasks/tasks.module.ts` ya no registra `UserSchema` e importa `UsersModule`.
- `TasksService` recibe `UsersService` por inyección de dependencias y lo usa para verificar que el usuario exista.

**Resultado.** La única puerta de entrada a los usuarios es `UsersService`. Crear una tarea con un usuario inexistente responde **404 Not Found**.

### Caso 3: middleware usado como control de acceso

**Cambios.**
- Se eliminó `src/auth.middleware.ts` y su registro en `src/app.module.ts` (se quitaron `NestModule` y `configure()`).
- Se creó `src/auth.guard.ts` (`AuthGuard`), que implementa `CanActivate`, revisa la cabecera `Authorization: admin-secret-token` y lanza `ForbiddenException` cuando no es válida.
- El guard se aplicó solo sobre `POST /tasks` con `@UseGuards(AuthGuard)`.

**Resultado.** Crear una tarea sin el token correcto responde **403 Forbidden** con el formato estándar de NestJS. Las rutas de consulta vuelven a ser públicas (**200**).

### Caso 4: lógica de negocio y modelos en el controlador de tareas

**Cambios.**
- El constructor de `TasksController` quedó con una sola dependencia: `TasksService`.
- La validación del usuario y la persistencia se trasladaron al método `create` de `TasksService`, que construye el documento campo por campo.
- `POST /tasks` recibe `CreateTaskDto` (ya validado por el pipe) y solo delega en el servicio.

**Resultado.** Cada capa cumple su función: el guard autoriza, el pipe valida el formato (400), el controlador delega y el servicio aplica la regla de negocio (404) y persiste.