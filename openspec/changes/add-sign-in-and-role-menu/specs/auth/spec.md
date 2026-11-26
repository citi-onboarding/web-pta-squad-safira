## Purpose

Lets DistriLux staff sign in to the portal with their email and password, keeps track of who is signed in, and limits navigation to what each role may use.

## ADDED Requirements

### Requirement: Sign-in screen

The portal SHALL show a sign-in screen with the DistriLux logo, the title "Entrar no portal", the text "Use o e-mail e a senha da DistriLux.", a required "E-mail" field with the placeholder "nome@distrilux.com.br", a required "Senha" password field, and an "Entrar" button.

#### Scenario: Visitor opens the sign-in screen

- **WHEN** a visitor without a session opens the sign-in screen
- **THEN** the screen shows the logo, the title, the text, both fields, and the "Entrar" button

#### Scenario: Empty fields are not submitted

- **WHEN** the visitor presses "Entrar" with the email or the password empty
- **THEN** no sign-in request is sent to the back end

### Requirement: Sign-in in progress

While a sign-in request is pending, the "Entrar" button SHALL indicate that sign-in is in progress and SHALL NOT accept another submission.

#### Scenario: Waiting for the back end

- **WHEN** the visitor submits valid-looking credentials and the back end has not answered yet
- **THEN** the button shows the in-progress state and cannot be pressed again

### Requirement: Credential error

When the back end rejects the credentials, the sign-in screen SHALL show "E-mail ou senha incorretos" inside the form and SHALL NOT indicate whether the email or the password was wrong.

#### Scenario: Wrong password

- **WHEN** the back end answers the sign-in request with 401
- **THEN** the form shows "E-mail ou senha incorretos", the visitor stays on the sign-in screen, and the button leaves the in-progress state

### Requirement: Session awareness

The portal SHALL determine the current user from the back end and SHALL treat a 401 answer as "no session", not as an application error.

#### Scenario: No session

- **WHEN** the back end answers the current-user request with 401
- **THEN** the portal considers the visitor signed out and shows no error message

#### Scenario: Existing session

- **WHEN** the back end answers the current-user request with a user
- **THEN** the portal considers that user signed in with the returned role

### Requirement: Protected pages

Every page except the sign-in screen SHALL require a session. A visitor without a session SHALL be sent to the sign-in screen, and after signing in SHALL return to the page originally requested.

#### Scenario: Opening a protected page without a session

- **WHEN** a visitor without a session opens a protected page
- **THEN** the sign-in screen is shown instead of the page

#### Scenario: Returning to the requested page

- **WHEN** that visitor signs in successfully
- **THEN** the portal shows the page originally requested

### Requirement: Initial page by role

After signing in without a previously requested page, the portal SHALL show the initial page of the user's role: VENDEDOR goes to "Clientes", GERENTE goes to "Painel do comercial", FINANCEIRO goes to "Fila do financeiro", and ADMINISTRADOR goes to "Usuários" (provisional until the squad manager confirms it).

#### Scenario: Salesperson signs in

- **WHEN** a VENDEDOR signs in from the sign-in screen
- **THEN** the portal shows the "Clientes" page

#### Scenario: Manager signs in

- **WHEN** a GERENTE signs in from the sign-in screen
- **THEN** the portal shows the "Painel do comercial" page

#### Scenario: Finance signs in

- **WHEN** a FINANCEIRO signs in from the sign-in screen
- **THEN** the portal shows the "Fila do financeiro" page

#### Scenario: Administrator signs in

- **WHEN** an ADMINISTRADOR signs in from the sign-in screen
- **THEN** the portal shows the "Usuários" page

### Requirement: Menu by role

The menu SHALL list only the entries of the signed-in role, followed by "Sair": VENDEDOR sees "Clientes" and "Meus pedidos"; GERENTE sees "Painel do comercial"; FINANCEIRO sees "Fila do financeiro"; ADMINISTRADOR sees "Usuários".

#### Scenario: Each role sees its own menu

- **WHEN** a user of a given role is signed in
- **THEN** the menu shows exactly that role's entries and "Sair", and no entry of another role

### Requirement: Access denied

When a signed-in user opens a page their role may not use, the portal SHALL show "Você não tem acesso a esta página" and SHALL NOT render the page content.

#### Scenario: Salesperson opens the users page

- **WHEN** a signed-in VENDEDOR opens the "Usuários" page
- **THEN** the portal shows "Você não tem acesso a esta página" and not the users page

### Requirement: Sign out

"Sair" SHALL end the session in the back end, discard every server response kept by the portal, and show the sign-in screen. Navigating back in the browser afterwards SHALL NOT show data from the ended session.

#### Scenario: Signing out

- **WHEN** a signed-in user presses "Sair"
- **THEN** the portal asks the back end to end the session and shows the sign-in screen

#### Scenario: Browser back after signing out

- **WHEN** the user presses the browser back button after signing out
- **THEN** the portal shows the sign-in screen and no data from the ended session
