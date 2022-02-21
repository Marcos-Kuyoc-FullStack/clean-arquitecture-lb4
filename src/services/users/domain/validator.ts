export const validatePasswordStrong = (password: string )=> {
  if (validateString(password)) {
    // TODO: Definir Algoritmo para validar si la contraseña es fuerte
    const regex = /^[a-z0-9_-]{8,18}$/;

    if (regex.test(password)) {
      return true
    }

    return false;
  }

  return false;
}

export const validateString = (str: string) => {
  if (str === null || str === undefined) {
    return false;
  }

  return true;
}