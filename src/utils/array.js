const filterItems = (needle, heystack, key) => {
  const query = needle.toLowerCase();
  if (key) return heystack.filter((item) => item[key].toLowerCase().indexOf(query) >= 0);
  return heystack.filter((item) => item.toLowerCase().indexOf(query) >= 0);
};

export default filterItems;
