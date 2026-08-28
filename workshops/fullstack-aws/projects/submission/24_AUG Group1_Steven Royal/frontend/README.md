## Team Work Division

To minimize merge conflicts and keep the frontend design consistent, each team member should own a specific feature area. Shared frontend components and page layouts should be reused across all features.

### Person 1 — Frontend Foundation & Integration Lead

**Responsibilities:**

- Set up Vite + React + Tailwind CSS
- Set up React routing
- Create the overall application layout
- Create shared UI components, such as:
  - Navbar
  - Button
  - Input
  - Card
  - Table
- Create the initial page shells for:
  - Login
  - Registration
  - Customer Dashboard
  - Teller Dashboard
  - Admin Dashboard
- Create/shared API utilities for communicating with FastAPI
- Integrate the other team members' frontend components
- Perform final styling and UI consistency cleanup

**Important:** Other team members should use the shared UI components rather than creating separate styles for common elements.

---

### Person 2 — Authentication

#### Backend Responsibilities

- Add password hashing
- Add password storage to the User model/database
- Implement JWT creation and verification
- Implement:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
- Update `get_current_user()` to authenticate using the JWT
- Protect backend endpoints using authenticated user information
- Add authentication tests

#### Frontend Responsibilities

- Implement Login functionality
- Implement Registration functionality
- Store/use the JWT after successful login
- Send the JWT with authenticated API requests
- Redirect users based on their role after login

---

### Person 3 — Customer Dashboard

**Responsibilities:**

- Build customer-facing React features
- Display the customer's accounts
- Display account balances
- Display the customer's transaction history
- Implement the transfer form
- Connect customer components to the appropriate backend endpoints
- Ensure customers can only access their own information

**Customer functionality should include:**

- View own accounts
- View own transactions
- Transfer money
- Logout

---

### Person 4 — Teller Dashboard

**Responsibilities:**

- Build teller-facing React features
- Implement customer lookup/listing
- Display a selected customer's accounts
- Implement deposits
- Implement withdrawals
- Implement account creation
- Connect teller components to the appropriate backend endpoints

**Teller functionality should include:**

- Find/view customers
- View customer accounts
- View customer transaction history
- Deposit money
- Withdraw money
- Create accounts

---

### Person 5 — Admin Dashboard

**Responsibilities:**

- Build admin-facing React features
- Implement user/staff management UI
- Implement account management functionality
- Implement account status controls where needed
- Add any missing admin-specific backend endpoints
- Help with backend authentication/integration tests if admin work is completed early

**Admin functionality may include:**

- View/manage users
- View/manage accounts
- Create staff/users
- Freeze or close accounts
- Access administrative information and controls

---

## Shared Frontend Rules

To prevent merge conflicts and inconsistent styling:

1. Each person should primarily modify files within their assigned feature area.
2. Shared components should be reused instead of recreated.
3. Avoid modifying another team member's files without coordinating first.
4. The frontend lead should own shared layout and styling files.
5. Feature developers should focus primarily on functionality and API integration.
6. Final visual styling should follow the agreed-upon UI mockups.
