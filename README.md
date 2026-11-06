# ProvexWebsite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Admin panel

The admin console is available at `/admin/login` and uses the existing backend and MongoDB database. It does not provide public registration.

Configure these variables in the backend runtime (for local development, use `server/.env` when running commands from `server/`, or a root `.env` when starting the server from the project root):

```text
MONGODB_URI=your-existing-mongodb-atlas-uri
JWT_SECRET=a-cryptographically-random-secret-of-at-least-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=a-unique-password-of-at-least-12-characters
```

Generate a fresh JWT secret and a unique admin password with a password manager. Never commit real values. Create or update the single admin account by running `npm run seed:admin` from `server/`. The seed command stores only a bcrypt password hash in MongoDB.

The frontend stores the short-lived (8 hour) JWT in `sessionStorage`; signing out clears it. All admin APIs also enforce JWT authentication on the server. Deploy the backend changes and configure `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the backend host before using the admin login. The Angular app continues to use the configured `apiUrl`.

Inquiry status values in the admin panel are `New`, `In Progress`, and `Completed`. Existing `Read` and `Contacted` records remain compatible and appear as `In Progress` and `Completed` respectively.

The public site is currently deployed using GitHub Pages. Configure the production static host to serve the Angular `index.html` for `/admin/*` paths (history fallback) so direct visits and refreshes on admin routes load the app.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
