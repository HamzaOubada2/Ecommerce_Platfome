import { SetMetadata } from "@nestjs/common";
import { Role } from "src/users/entities/user.entity";

export const Roles = (...roles: Role[]) => SetMetadata('roles',roles);

// ### 🔐 Roles Guard — Summary

// ```ts
// @Roles(Role.ADMIN)
// ```

// ⬇️

// **`Roles()`** stores the roles as **metadata**.

// ⬇️

// **`Reflector`** reads the metadata inside `RolesGuard`.

// ⬇️

// The Guard checks:

// ```ts
// requiredRoles.includes(user.role)
// ```

// ⬇️

// ✅ Correct role → Access granted
// ❌ Wrong role → `403 Forbidden`
