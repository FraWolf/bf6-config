export const parseConfigFile = (content: string): Record<string, any> => {
  const config: Record<string, any> = {};
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#"))
      continue;

    const match = trimmed.match(/^([A-Za-z]+)\.([\w\-]+)\s*([-+]?\d*\.?\d+)?$/);

    if (match) {
      const [, key, value] = match;
      config[key] = value.replace(/"/g, "");
    }
  }

  return config;
};
