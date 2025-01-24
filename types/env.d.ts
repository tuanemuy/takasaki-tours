namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    DATABASE_URL: string;
    DATABASE_AUTH_TOKEN: string;
    AUTH_SECRET: string;
    EMAIL_FROM: string;
    NOTIFY_TO: string;
    EMAIL_SERVER: string;
    SENDGRID_KEY: string;
    AUTH_SENDGRID_KEY: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    AUTH_SENDGRID_KEY: string;
    GCS_BUCKET_NAME: string;
    GOOGLE_APPLICATION_CREDENTIALS: string;
    GOOGLE_RECAPTCHA_SECRET_KEY: string;
  }
}
