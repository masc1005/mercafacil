export function extractDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatPhoneMacapa(phone: string): string {
  const digits = extractDigits(phone);
  const country = digits.slice(0, 2);
  const ddd = digits.slice(2, 4);
  const part1 = digits.slice(4, 9);
  const part2 = digits.slice(9, 13);
  return `+${country} (${ddd}) ${part1}-${part2}`;
}

export function formatPhoneVarejao(phone: string): string {
  return extractDigits(phone);
}

export function formatPhone(phone: string, store: string): string {
  const formatters: Record<string, (phone: string) => string> = {
    macapa: formatPhoneMacapa,
    varejao: formatPhoneVarejao,
  };

  const formatter = formatters[store];

  if (!formatter) {
    throw new Error(`Formatter não encontrado para: ${store}`);
  }

  return formatter(phone);
}
