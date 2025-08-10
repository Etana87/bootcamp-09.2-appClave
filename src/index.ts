import { validarClave } from './validators';
import { commonPasswords } from './commonPasswords';

const ejemplos = [
  { usuario: 'jimena', clave: 'Password123!' }, // válida
  { usuario: 'ana', clave: 'ana12345' },        // contiene nombre + sin mayúsculas
  { usuario: 'pepito', clave: 'weak' },         // muy corta y sin números, etc.
  { usuario: 'user', clave: 'Password' },       // sin números ni caracteres especiales
  { usuario: 'maria', clave: 'qwerty123!' }     // contiene palabra común 'qwerty'
];

for (const e of ejemplos) {
  const res = validarClave(e.usuario, e.clave, commonPasswords);
  console.log(`Usuario: ${e.usuario} | Clave: ${e.clave} ->`, res);
}
