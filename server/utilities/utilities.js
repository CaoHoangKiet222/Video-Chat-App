exports.sortName = (array) => {
   return array.sort((obj1, obj2) => {
      if (obj1.name > obj2.name) return 1;
      if (obj1.name < obj2.name) return -1;
      return 0;
   })
}
