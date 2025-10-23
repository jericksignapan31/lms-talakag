# Sakai19

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

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

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

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

## Mock API (json-server)

This project includes a mock REST API powered by json-server to help with local development.

Endpoints base URL: http://localhost:3000

When running the Angular dev server, use the `/api` prefix and it will be proxied to the mock API. Example requests from the app should call `/api/users`, `/api/courses`, etc.

### Scripts

- `npm run start:api` — start json-server at http://localhost:3000
- `npm run start:dev` — run Angular dev server and json-server together

### Data file

Edit `db.json` at the project root to change seed data. json-server provides standard REST routes:

- GET/POST `/:resource` (e.g., `/users`, `/courses`)
- GET/PATCH/PUT/DELETE `/:resource/:id`

### Proxy

`proxy.conf.json` forwards `/api/*` to `http://localhost:3000/*` so you can call `/api/...` from Angular without CORS issues.
