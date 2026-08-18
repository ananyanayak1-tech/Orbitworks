export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const str = String(dateStr).trim();

  // If it's a number (integer or decimal), return as-is
  if (/^\d+(\.\d+)?$/.test(str)) {
    return dateStr;
  }

  // Already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }

  // Already in DD-MM-YYYY format, convert to slash format
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    return str.replace(/-/g, '/');
  }

  // Parse YYYY-MM-DD or ISO (with or without 'T')
  const datePart = str.split('T')[0];
  const parts = datePart.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // Try Javascript Date parsing as fallback
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    // Ignore and fallback
  }

  return dateStr;
};

export const formatAllDatesInText = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, (match) => formatDate(match));
};
