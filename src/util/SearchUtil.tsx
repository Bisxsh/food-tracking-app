export const getFilteredList = (search: string, list: string[]) => {
  return list.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );
};
