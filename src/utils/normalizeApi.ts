export const toStringId = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

export const toNumberId = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/\D/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

export const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return ['1', 'true', 'yes', 'active'].includes(value.toLowerCase());
  return false;
};

export const pickString = (item: Record<string, unknown>, keys: string[], fallback = ''): string => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return fallback;
};

export const pickNumber = (item: Record<string, unknown>, keys: string[], fallback = 0): number => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const numeric = Number(value);
      if (!Number.isNaN(numeric)) {
        return numeric;
      }
    }
  }
  return fallback;
};

export const pickOptionalNumber = (item: Record<string, unknown>, keys: string[]): number | undefined => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const numeric = Number(value);
      if (!Number.isNaN(numeric)) {
        return numeric;
      }
    }
  }
  return undefined;
};

export const pickBoolean = (item: Record<string, unknown>, keys: string[], fallback = false): boolean => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string' && value.trim()) {
      return ['1', 'true', 'yes', 'active'].includes(value.toLowerCase());
    }
  }
  return fallback;
};

export const readDataObject = <T extends Record<string, unknown>>(payload: Record<string, unknown>, key?: string): T => {
  const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
  if (key) {
    return (data[key] as T | undefined) ?? ({} as T);
  }
  return data as T;
};

export const readDataArray = <T extends Record<string, unknown>>(payload: Record<string, unknown>, key: string): T[] => {
  const data = (payload.data as Record<string, unknown> | undefined) ?? {};
  return (data[key] as T[] | undefined) ?? [];
};

export const unwrapApiData = (payload: Record<string, unknown>): unknown => payload.data ?? payload;

export const readApiArray = <T>(payload: Record<string, unknown>): T[] => {
  const data = unwrapApiData(payload);
  return Array.isArray(data) ? (data as T[]) : [];
};

export const readApiObject = <T>(payload: Record<string, unknown>): T => {
  const data = unwrapApiData(payload);
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as T) : ({} as T);
};

const CATEGORY_RULES = [
  { slug: 'dong-ho-thong-minh', patterns: ['dong ho thong minh', 'dong-ho-thong-minh', 'smartwatch'] },
  { slug: 'dong-ho-the-thao', patterns: ['dong ho the thao', 'dong-ho-the-thao'] },
  { slug: 'dong-ho-quartz', patterns: ['dong ho quartz', 'dong-ho-quartz'] },
  { slug: 'dong-ho-nam', patterns: ['dong ho nam', 'dong-ho-nam'] },
  { slug: 'dong-ho-nu', patterns: ['dong ho nu', 'dong-ho-nu'] },
  { slug: 'dong-ho-co', patterns: ['dong ho co', 'dong-ho-co', 'automatic', 'mechanical'] },
];

export const normalizeCategorySlug = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const lower = value.trim().toLowerCase();
  if (!lower) return '';

  const ascii = lower
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const candidates = [lower, ascii, ascii.replace(/-/g, '')];
  for (const rule of CATEGORY_RULES) {
    if (candidates.some((candidate) => rule.patterns.some((pattern) => candidate.includes(pattern)))) {
      return rule.slug;
    }
  }

  return ascii;
};
