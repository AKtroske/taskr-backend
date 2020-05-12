// set empty values to setNUll

module.exports = (obj) => {
  var keys = Object.keys(obj)
  for (var key of keys){
    if (obj[key]=== ''){
      obj[key]= null
    }
  }
  return obj
}
