import "i18next";

import es from "@/src/i18n/locales/es.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof es;
    };
  }
}
