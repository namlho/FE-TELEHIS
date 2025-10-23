export const buildGenericFilters = (filters, comparators = {}) => {
  return (item) => {
    for (const key in filters) {
      const filterValue = filters[key];

      if (filterValue === 'all' || filterValue === '' || filterValue == null) {
        continue;
      }

      const comparator = comparators[key];
      if (typeof comparator === 'function') {
        if (!comparator(item[key], filterValue, item)) {
          return false;
        }
      } else {
        if (item[key] !== filterValue) {
          return false;
        }
      }
    }

    return true;
  };
};

// ✅ Thêm hàm này
export const getUniqueValues = (data, accessor) => {
  const seen = new Set();
  const results = [];
  data.forEach(item => {
    const value = accessor(item);
    if (value && !seen.has(value)) {
      seen.add(value);
      results.push(value);
    }
  });
  return results;
};
