
/* PAR CONVENTION LES REPONSES RES SONT FORMATEES EN JSON VIA req.json (methode express)
PAR CONVENTION LE JSON CONTIENT UNE CLE "status" ET UNE CLE "result"*/
exports.success = function(result) {
  return {
    status: 'success',
    result: result
  }
}
exports.error = function(message) {
  return {
    status: 'error',
    result: message
  }
}

/* Function pour retourner true ou false si err est une erreur ou non

*/
exports.isErr = (err) => {
  return err instanceof Error
}


exports.checkAndChange = (obj) => {
  if(this.isErr(obj)) {
    return this.error(obj.message)
  } else {
    return this.success(obj)
  }
}
