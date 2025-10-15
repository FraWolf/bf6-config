export const parseConfigFile = (content: string): Record<string, Record<string, any>> => {
  const config: Record<string, Record<string, any>> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z]+)\.([\w\-]+)\s*([-+]?\d*\.?\d+)?$/);

    if (match) {
      const [_, category, key, value] = match;

      // Create config category if it doesn't exists
      if (!config[category]) {
        config[category] = {};
      }

      // Update value
      config[category][key] = (value || 'None')?.replace(/"/g, '');
    }
  }

  return config;
};
