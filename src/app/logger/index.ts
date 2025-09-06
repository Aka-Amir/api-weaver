const PREFIX = ' Apiva 🕸️ ';
export default {
  warn(message: unknown, ...params: unknown[]) {
    console.error(`${PREFIX} > `, message, ...params);
  },
  log(message: unknown, ...params: unknown[]) {
    console.error(`${PREFIX} > `, message, ...params);
  },
  error(message: unknown, ...params: unknown[]) {
    console.error(`${PREFIX} > `, message, ...params);
  },
};
