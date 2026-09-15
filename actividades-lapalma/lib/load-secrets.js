/** Carga secretos de deploy efímero si faltan en process.env. No commitear deploy-secrets.js. */
export function loadDeploySecrets() {
  if (process.env.DATABASE_URL && process.env.ADMIN_PASSWORD) return;
  try {
    // eslint-disable-next-line import/no-unresolved, global-require
    const secrets = require("./deploy-secrets.js");
    if (secrets?.DATABASE_URL && !process.env.DATABASE_URL) {
      process.env.DATABASE_URL = secrets.DATABASE_URL;
    }
    if (secrets?.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD) {
      process.env.ADMIN_PASSWORD = secrets.ADMIN_PASSWORD;
    }
    if (secrets?.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL) {
      process.env.NEXT_PUBLIC_APP_URL = secrets.NEXT_PUBLIC_APP_URL;
    }
  } catch {
    // local / Vercel con env reales
  }
}

loadDeploySecrets();
