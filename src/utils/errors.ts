// The backend answers `/mobile/auth/*` in English (or with a code such as `existing_email`).
const AUTH_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'Adresse email ou mot de passe incorrect.',
  'Validation failed.': 'Vérifiez les informations saisies : email valide et mot de passe de 8 caractères minimum.',
  existing_email: 'Un compte existe déjà avec cette adresse email.',
  'Too many login attempts. Please try again later.': 'Trop de tentatives de connexion. Réessayez plus tard.',
  'Too many registration attempts. Please try again later.': 'Trop de tentatives d’inscription. Réessayez plus tard.',
  'Too many attempts. Please try again later.': 'Trop de tentatives. Réessayez plus tard.',
  'Too many requests. Please try again later.': 'Trop de demandes. Réessayez plus tard.',
  'Invalid or expired auth code': 'Code invalide ou expiré.',
  'User not found': 'Aucun compte ne correspond à cette adresse email.',
  'User not found.': 'Aucun compte ne correspond à cette adresse email.',
};

/** Extracts a readable message from whatever the API client rejected with. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string' && error) return AUTH_MESSAGES[error] ?? error;
  if (error && typeof error === 'object') {
    const e = error as { message?: unknown; detail?: unknown; error?: unknown; description?: unknown };
    for (const v of [e.detail, e.message, e.error, e.description]) {
      if (typeof v === 'string' && v) return AUTH_MESSAGES[v] ?? v;
    }
  }
  return fallback;
}
