# Tutorial

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---
## Modificaciones respecto al Tutorial

### General

- Implementación de un id orientativo para mejorar el UX a la hora de crear un nuevo Elemento.
- Creación de un botón Registrarse, abriendo la posibilidad a crear más usuarios. Esto viene con una validación de que no  **No Existan** usuarios con nombres iguales.
- El logo y el nombre de la página también se muestran el la pestaña del navegador.
- En **Todas** las *pages* se ha aplicado el siguiente diseño:
  - ***Header*** con el nombre de la *page* y los filtros en caso de que existan.
  - ***Container*** con la tabla.
    - En caso de overflow vertical, **solo** la tabla tendrá scroll.
    - En caso de ser una *page* paginada, el *mat-paginator* se mantiene el final de la tabla, sin importar la cantidad de elementos.
  - ***Footer*** con el botón *create*. Solo visible manteniendo el diseño original (Cuando el usuario ha iniciado sesión de manera exitosa)
- El **Header** global, revisa cada vez que se recarga si el token ha expirado o no. En caso de *token no válido* muestra un mensaje al usuario y cierra la sesión de este.
- Tras la verificación de borrado de un elemento según el diseño, se muestra al usuario un mensaje con el motivo (*En Uso*, *Protegido*,...) y la lista de **Entidades** en las que está *En Uso* si es es el caso.
- Los modales de **Editar** deshabilitan el botón de **Guardar** si los datos introducidos son iguales a los que tenía el *Elemento* antes de editarlo.
- El botón **Cerrar sesión** del *Header* muestra un mensaje de confirmación antes de cerrar la sesión.
### Categorias

- Ninguna modificación extra a las anteriores mencionadas.

### Autores

- A la hora de **Eliminar** un *Autor* válido, si con esto quedase una página con lista vacía, pide al *backend* la página anterior y la muestra.
- A la hora de **Crear** un *Autor*, si con esto se sobrepasa el límite de elementos de la página, pide al *backend* la página siguiente y la muestra. 

### Clientes

- No se puede **Eliminar** un *Cliente* si tiene un *Préstamo* activo o futuro.


### Catálogo

- Los filtros se ejecutan de forma dinámica. Mantenemos el botón filtrar por mantener el diseño original del Layour
- Cuando el usuario ha **iniciado sesión**, los *Juegos* muestran un **Glow** al pasar el ratón por encima de ellos, indicando al usuario el *Juego* que va a editar.

### Préstamos

- Mismas modificaciones respecto a la lista páginada que en **Autores**.
- Filtros estáticos.
- Por defecto, el filtro de la **Fecha** muestra la fecha de hoy. Implementa un botón para borrarla.
- El filtro de la **Fecha** solo permite su uso mediante *DatePickerToggle*.
- El botón **Filtrar** pone los campos de los filtros en *Default*.
- El botón **Editar** está deshabilitado para los *Préstamos* que ya han finalizado.
- Solo se pueden **Borrar** los *Préstamos* que no estén en proceso.
- La lista se ordena por *Fecha de inicio del préstamo* en orden ascendente.
- A la hora de **Crear** o **Editar** un préstamo:
  - Se han eliminado los *mensajes de error* y se han sustituido por *filtros dinámicos*, que solo permiten esoger al usuario los datos válidos según los que va teniendo el formulario. Esto no elimina la comprobación de las restricciones en el *backend*.
  - La **Fecha de inicio del préstamo** no puede ser anterior a hoy. Está puesto un límite desde el *backend* de **60 días** desde la fecha de hoy para el rango de *fechas válidas de inico del préstamo*
  - La selección de **Fecha de fin del préstamos** está deshabilitada hasta que se seleccione una *Fecha de inicio del préstamo*.
  - A la hora de **Editar** un préstamo, este no se toma en cuenta para aplicar los filtros dinámicos.


### Otros

-Implementación de un **interceptor** para añadir el token (*JWT*) en todas la cabecera de todas las peticiones salientes.<br>[Interceptor](./src/core/service/jwtInterceptor.service.ts)

