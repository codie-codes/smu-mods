import { env } from "@/env";

export class Logger {
  static log(...args: any[]) {
    const bypassEnvCheck =
      typeof args[args.length - 1] === "boolean" ? args.pop() : false;

    if (env.NEXT_PUBLIC_NODE_ENV !== "production" || bypassEnvCheck) {
      const formattedMessage = Logger.formatMessage("LOG", ...args);
      console.log(formattedMessage);
    }
  }

  static error(...args: any[]) {
    const formattedMessage = Logger.formatMessage("ERROR", ...args);
    console.error(formattedMessage);
  }

  static warn(...args: any[]) {
    const bypassEnvCheck =
      typeof args[args.length - 1] === "boolean" ? args.pop() : false;

    if (env.NEXT_PUBLIC_NODE_ENV !== "production" || bypassEnvCheck) {
      const formattedMessage = Logger.formatMessage("WARN", ...args);
      console.warn(formattedMessage);
    }
  }

  private static formatMessage(level: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const originalMessage = args
      .map((arg) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
      )
      .join(" ");
    return `[${timestamp}] [${level}]: ${originalMessage}`;
  }
}
