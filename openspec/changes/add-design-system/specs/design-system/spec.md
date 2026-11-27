## Purpose

Gives every portal screen the same visual language and the same base behavior for money, status, themes, messages, loading, empty and error states, dialogs and navigation, on desktop and on a 390 px phone.

## ADDED Requirements

### Requirement: Money in reais

The portal SHALL show every money amount in reais in the format `R$ 1.234,56`, including negative amounts.

#### Scenario: Positive amount

- **WHEN** an amount of 123456 cents is shown
- **THEN** the screen shows "R$ 1.234,56"

#### Scenario: Zero

- **WHEN** an amount of 0 cents is shown
- **THEN** the screen shows "R$ 0,00"

#### Scenario: Negative amount

- **WHEN** an amount of -50000 cents is shown
- **THEN** the screen shows the amount as negative, "-R$ 500,00"

### Requirement: Client status

The portal SHALL show a client's status with the text "Ativo", "Bloqueado" or "Inativo" and a distinct icon or outline for each, so the status is readable without relying on color.

#### Scenario: Each client status has its own text

- **WHEN** an active, a blocked and an inactive client are shown
- **THEN** their statuses read "Ativo", "Bloqueado" and "Inativo"

#### Scenario: Active is not confused with a sent order

- **WHEN** an active client and a sent order appear on the same screen
- **THEN** the client status shows an outline with a check and no fill, and the order status shows a filled marker

### Requirement: Order and credit status

The portal SHALL show order and credit statuses with their own text and icon, and SHALL use red only for error statuses.

#### Scenario: Order blocked by credit

- **WHEN** an order blocked by credit is shown
- **THEN** its status shows its text with a warning icon and is not red

#### Scenario: Order with a sending error

- **WHEN** an order whose sending to the ERP failed is shown
- **THEN** its status shows its text with an error icon in red

### Requirement: Form fields

Every form field SHALL have a visible label linked to it, SHALL show a visible focus when reached with the keyboard, SHALL not accept input when disabled, and SHALL announce its error message when it has one.

#### Scenario: Field found by its label

- **WHEN** a person using a screen reader reaches a field
- **THEN** the field is announced by its label

#### Scenario: Field with an error

- **WHEN** a field has an error
- **THEN** the field is marked invalid and its error message is announced

#### Scenario: Disabled field

- **WHEN** a field is disabled
- **THEN** typing or choosing in it has no effect

### Requirement: Actions

Every action button SHALL show a visible focus when reached with the keyboard and SHALL NOT run its action while disabled or in progress.

#### Scenario: Disabled action

- **WHEN** the person presses a disabled action
- **THEN** nothing happens

#### Scenario: Action in progress

- **WHEN** an action is in progress and the person presses it again
- **THEN** the action does not run a second time

### Requirement: Data tables

Tables SHALL have a header row naming each column and SHALL align money and other numbers to the right. On a 390 px phone, each row SHALL become a stacked card with the same information, without horizontal scrolling.

#### Scenario: Table on desktop

- **WHEN** a list of clients with their available limit is shown on desktop
- **THEN** the table has a header row and the limit column is aligned to the right

#### Scenario: Table on a phone

- **WHEN** the same list is shown at 390 px width
- **THEN** each client appears as a stacked card with the same information and nothing needs horizontal scrolling

### Requirement: Back links

Inner screens SHALL offer a link back to the screen they came from, written as an arrow followed by the destination (for example "← Clientes") and announced to screen readers as "Voltar para" followed by the destination. Without a destination name, the link SHALL read "← Voltar".

#### Scenario: Back to the client list

- **WHEN** a screen offers a way back to the client list
- **THEN** it shows "← Clientes", announced as "Voltar para Clientes", and it opens the client list

#### Scenario: Back without a destination name

- **WHEN** a screen offers a way back without naming the destination
- **THEN** it shows "← Voltar", announced as "Voltar"

### Requirement: Messages

The portal SHALL show information and error messages with an icon and text. Error messages SHALL be announced to screen readers as soon as they appear.

#### Scenario: Error message appears

- **WHEN** an error message appears on the screen
- **THEN** it shows an error icon and its text, and a screen reader announces it

### Requirement: Loading, empty and error states

Every screen that loads data SHALL show a loading state while waiting, an empty-state message when there is nothing to show, and an error message with a "Tentar de novo" action when loading fails.

#### Scenario: Waiting for data

- **WHEN** the data has not arrived yet
- **THEN** the screen shows the loading state and announces that it is loading

#### Scenario: Nothing to show

- **WHEN** the data arrives empty
- **THEN** the screen shows its empty-state message instead of an empty table

#### Scenario: Loading fails

- **WHEN** loading the data fails
- **THEN** the screen shows an error message without technical codes and a "Tentar de novo" action

#### Scenario: Trying again

- **WHEN** the person presses "Tentar de novo"
- **THEN** the screen loads the data again

### Requirement: ERP sync indicator

The portal SHALL show, on every signed-in screen, when the data was last synchronized with the ERP, and SHALL say so when the ERP is unavailable (US-002).

#### Scenario: ERP available

- **WHEN** the last synchronization was on 19/11/2026 at 14:02 and the ERP is available
- **THEN** the header shows "Sincronizado com o ERP em 19/11/2026 14:02"

#### Scenario: ERP unavailable

- **WHEN** the ERP is unavailable and the data is from 19/11/2026 at 14:02
- **THEN** the header shows "ERP fora do ar · dados de 19/11/2026 14:02" with an icon, not only a color

### Requirement: Dialogs

Dialogs SHALL keep the keyboard focus inside them while open, SHALL close when the person presses Esc or the cancel action, and SHALL return the focus to where it was.

#### Scenario: Closing with Esc

- **WHEN** a dialog is open and the person presses Esc
- **THEN** the dialog closes and the focus returns to the control that opened it

#### Scenario: Focus stays inside

- **WHEN** a dialog is open and the person presses Tab repeatedly
- **THEN** the focus moves only among the dialog's controls

### Requirement: Signed-in layout

Every signed-in screen SHALL show a header with the DistriLux logo, the person's name and role and the theme switch, a menu with the entries of the person's role and the current entry highlighted, and the content area. On a 390 px phone the menu SHALL become a select below the header, without horizontal scrolling.

#### Scenario: Current page highlighted

- **WHEN** a seller is on the client list
- **THEN** the menu shows the seller's entries with "Clientes" marked as the current page

#### Scenario: Phone width

- **WHEN** a signed-in screen is opened at 390 px width
- **THEN** the menu is a select below the header and nothing needs horizontal scrolling

### Requirement: Light and dark themes

The portal SHALL offer a light and a dark theme. Without a stored choice it SHALL follow the operating system preference; a theme switch SHALL let the user change the theme, and the choice SHALL be kept when the user comes back.

#### Scenario: First visit with the system in dark mode

- **WHEN** a visitor with no stored choice opens the portal and the system prefers dark
- **THEN** the portal shows the dark theme

#### Scenario: Switching the theme

- **WHEN** the portal is in the light theme and the user presses the button "Ativar tema escuro"
- **THEN** the portal changes to the dark theme at once and the button is now named "Ativar tema claro"

#### Scenario: Choice is remembered

- **WHEN** the user chose a theme and reloads the page
- **THEN** the portal opens in the chosen theme, even if the system prefers the other one

#### Scenario: Switch works with the keyboard

- **WHEN** the user reaches the theme switch with Tab and presses Space or Enter
- **THEN** the theme changes

#### Scenario: The switch shows whether the light is on

- **WHEN** the portal is in the light theme
- **THEN** the switch reads "ON", and in the dark theme it reads "OFF"

#### Scenario: Switch on the sign-in screen

- **WHEN** a visitor opens the sign-in screen
- **THEN** the theme button is on the form side, not on the brand panel

### Requirement: Contrast in both themes

Text and controls SHALL meet WCAG AA contrast in the light and in the dark theme.

#### Scenario: Sign-in screen in both themes

- **WHEN** the sign-in screen is checked for accessibility in the light theme and in the dark theme
- **THEN** no contrast violation is reported

### Requirement: Sign-in brand panel

The sign-in screen SHALL show a brand panel with the DistriLux logo, the title "Portal de pedidos da DistriLux", the text "Carteira, limite de crédito e pedidos num só lugar, sincronizados com o ERP" and the signature "DistriLux Materiais Elétricos · Recife". The decorative tile drawing SHALL be hidden from screen readers.

#### Scenario: Visitor opens the sign-in screen

- **WHEN** a visitor without a session opens the sign-in screen
- **THEN** the brand panel shows the logo, the title, the text and the signature next to the form

#### Scenario: Screen reader skips the decoration

- **WHEN** a screen reader reads the sign-in screen
- **THEN** it announces the logo by its name "DistriLux" and does not announce the tile drawing

### Requirement: Sign-in on a phone

The sign-in screen SHALL be usable at 390 px width without horizontal scrolling.

#### Scenario: Sign-in on a phone

- **WHEN** the sign-in screen is opened at 390 px width
- **THEN** every field and the sign-in button are visible without horizontal scrolling

### Requirement: Sign-in credential error keeps hiding the wrong field

When the back end rejects the credentials, the sign-in screen SHALL show an alert "E-mail ou senha incorretos." with an icon above the fields and SHALL mark both fields as invalid, without saying which one is wrong.

#### Scenario: Wrong password

- **WHEN** the back end rejects the credentials
- **THEN** the screen shows the alert "E-mail ou senha incorretos." and both the email and the password fields are marked as invalid

### Requirement: Sign-in fields are checked before sending

The sign-in screen SHALL check the fields itself, in the portal's own style, before sending anything: an empty email shows "Preencha o e-mail.", an empty password shows "Preencha a senha.", and an email that is not valid shows "Digite um e-mail válido, como nome@distrilux.com.br.". Each message SHALL appear under its field, mark that field invalid, and no request SHALL be sent to the back end.

#### Scenario: Empty email

- **WHEN** the visitor presses the sign-in button with the email empty and the password filled
- **THEN** the email field shows "Preencha o e-mail." and is marked invalid, and no request is sent

#### Scenario: Both fields empty

- **WHEN** the visitor presses the sign-in button with both fields empty
- **THEN** the email field shows "Preencha o e-mail." and the password field shows "Preencha a senha."

#### Scenario: Email that is not valid

- **WHEN** the visitor writes "ana.distrilux.com.br" as the email and presses the sign-in button
- **THEN** the email field shows "Digite um e-mail válido, como nome@distrilux.com.br." and no request is sent

#### Scenario: Messages go away once the fields are right

- **WHEN** the visitor fixes the fields and presses the sign-in button again
- **THEN** the field messages disappear and the sign-in request is sent

### Requirement: Sign-in in progress label

While a sign-in request is pending, the sign-in button SHALL read "Entrando…" and SHALL NOT accept another submission.

#### Scenario: Waiting for the back end

- **WHEN** the visitor submits the form and the back end has not answered yet
- **THEN** the button reads "Entrando…" and cannot be pressed again

### Requirement: Demo controls only in demo mode

The sign-in screen SHALL show the prototype shortcuts ("Gerente comercial", "Financeiro") and the "Simular" controls ("Normal", "Erro", "Entrando") only when the portal runs in demo mode. Outside demo mode they SHALL NOT be shown.

#### Scenario: Normal build

- **WHEN** the sign-in screen is opened outside demo mode
- **THEN** no shortcut and no "Simular" control is shown

#### Scenario: Demo build

- **WHEN** the sign-in screen is opened in demo mode
- **THEN** the shortcuts and the "Simular" controls are shown below a divider

#### Scenario: Shortcut fills in only the email

- **WHEN** in demo mode the visitor chooses the shortcut "Gerente comercial"
- **THEN** the email field holds "fernanda@distrilux.test", the password stays empty for the visitor to type, and nothing is sent to the back end

#### Scenario: Simulating the error state

- **WHEN** in demo mode the visitor chooses "Erro" in "Simular"
- **THEN** the screen shows the credential error state without calling the back end
