const createArrayFromRange = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

export default createArrayFromRange;
