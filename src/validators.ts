import { ValidacionClave } from './types';

// 1) Mayúsculas y minúsculas
export const tieneMayusculasYMinusculas = (clave: string): ValidacionClave => {
  const tieneMayus = /[A-Z]/.test(clave);
  const tieneMinus = /[a-z]/.test(clave);
  if (!tieneMayus || !tieneMinus) {
    return { esValida: false, error: 'La clave debe de tener mayúsculas y minúsculas' };
  }
  return { esValida: true };
};

// 2) Números
export const tieneNumeros = (clave: string): ValidacionClave => {
  if (!/\d/.test(clave)) {
    return { esValida: false, error: 'La clave debe de tener números' };
  }
  return { esValida: true };
};

// 3) Caracteres especiales
// Usamos una expresión que cubre los caracteres especiales más comunes.
export const tieneCaracteresEspeciales = (clave: string): ValidacionClave => {
  const specialRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?`~]/;
  if (!specialRegex.test(clave)) {
    return { esValida: false, error: 'La clave debe de tener caracteres especiales' };
  }
  return { esValida: true };
};

// 4) Longitud mínima (8)
export const tieneLongitudMinima = (clave: string): ValidacionClave => {
  if (clave.length < 8) {
    return { esValida: false, error: 'La clave debe de tener una longitud mínima de 8 caracteres' };
  }
  return { esValida: true };
};

// 5) No debe contener el nombre del usuario
export const tieneNombreUsuario = (nombreUsuario: string, clave: string): ValidacionClave => {
  const nombre = nombreUsuario.trim().toLowerCase();
  if (!nombre) return { esValida: true }; // si no hay nombre, no se aplica

  const claveLower = clave.toLowerCase();

  // Comprobamos el nombre completo
  if (nombre.length >= 1 && claveLower.includes(nombre)) {
    return { esValida: false, error: 'La clave no debe tener el nombre del usuario' };
  }

  // Además comprobamos partes del nombre (por ejemplo "maria.perez" -> "maria", "perez")
  const partes = nombre.split(/[^a-z0-9]+/i).filter(Boolean);
  for (const parte of partes) {
    if (parte.length >= 1 && claveLower.includes(parte)) {
      return { esValida: false, error: 'La clave no debe tener el nombre del usuario' };
    }
  }

  return { esValida: true };
};

// 6) No debe contener palabras comunes
export const tienePalabrasComunes = (clave: string, commonPasswords: string[]): ValidacionClave => {
  const claveLower = clave.toLowerCase();
  for (const p of commonPasswords) {
    const pLow = p.toLowerCase();
    if (!pLow) continue;
    if (claveLower.includes(pLow)) {
      return { esValida: false, error: 'La clave no debe de contener palabras comunes' };
    }
  }
  return { esValida: true };
};

// Función principal: ejecuta las comprobaciones en el orden pedido
export const validarClave = (
  nombreUsuario: string,
  clave: string,
  commonPasswords: string[]
): ValidacionClave => {
  const ordenComprobaciones: ((...args: any[]) => ValidacionClave)[] = [
    (c: string) => tieneMayusculasYMinusculas(c),
    (c: string) => tieneNumeros(c),
    (c: string) => tieneCaracteresEspeciales(c),
    (c: string) => tieneLongitudMinima(c),
    (n: string, c: string) => tieneNombreUsuario(n, c),
    (c: string, commons: string[]) => tienePalabrasComunes(c, commons)
  ];

  // Ejecutamos en el orden y devolvemos el primer error encontrado
  // Nota: adaptamos los parámetros según la comprobación
  // 1
  const r1 = tieneMayusculasYMinusculas(clave);
  if (!r1.esValida) return r1;

  // 2
  const r2 = tieneNumeros(clave);
  if (!r2.esValida) return r2;

  // 3
  const r3 = tieneCaracteresEspeciales(clave);
  if (!r3.esValida) return r3;

  // 4
  const r4 = tieneLongitudMinima(clave);
  if (!r4.esValida) return r4;

  // 5
  const r5 = tieneNombreUsuario(nombreUsuario, clave);
  if (!r5.esValida) return r5;

  // 6
  const r6 = tienePalabrasComunes(clave, commonPasswords);
  if (!r6.esValida) return r6;

  // Si pasa todo:
  return { esValida: true };
};