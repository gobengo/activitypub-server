export type DefaultLogLevel = "info" | "debug";
export type LogFunction<Level = DefaultLogLevel> = (
  level: Level,
  ...loggables: any[]
) => void;

export const ConsoleLogFunction =
  (): LogFunction =>
  (level, ...loggables) => {
    switch (level) {
      case "info":
        console.info(...loggables);
        break;
      case "debug":
        console.debug(...loggables);
        break;
      default:
        const _x: never = level;
        throw new Error(`uenxpected log level: ${level}`);
    }
  };
