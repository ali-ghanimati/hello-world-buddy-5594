export interface AuthUser {
  name: string;
  identifier: string;
}

export interface LoginInput {
  identifier: string;
}

export interface RegisterInput {
  name: string;
  identifier: string;
}

export interface AuthResult {
  user: AuthUser;
}

/**
 * Mock authentication service.
 *
 * This service intentionally contains no UI state and no React code.
 * The current implementation is local/mock only.
 *
 * Later this is the only layer that should need to change
 * when connecting authentication to WordPress / WooCommerce.
 */

export async function loginUser(
  input: LoginInput,
): Promise<AuthResult> {
  return {
    user: {
      name: "کاربر شیکو",
      identifier: input.identifier,
    },
  };
}

export async function registerUser(
  input: RegisterInput,
): Promise<AuthResult> {
  return {
    user: {
      name: input.name,
      identifier: input.identifier,
    },
  };
}

export async function logoutUser(): Promise<void> {
  // Mock logout.
  // Real implementation will invalidate the server-side session/token.
}
