const getPagination = ({ array, page, limit, firstIndex = -1}) => {
  if (firstIndex >= 0) {
    const end = Number(firstIndex) + Number(limit)
    console.log({firstIndex, end})
    return array.slice(firstIndex, end);
  } else if (page && limit) {
    const first = (Number(page) - 1) * Number(limit);
    const end = first + Number(limit);
    console.log({first, end})
    return array.slice(first, end);
  }
  return array;
};

module.exports = {
  getPagination,
};
