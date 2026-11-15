import http from 'k6/http';
import { check } from 'k6';

const baseUrl = 'https://dummyjson.com';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    //1listar usuarios por id
    const lista = http.get(`${baseUrl}/users`);
    if (!check(lista, { 'La lista responde con HTTP 200': (r) => r.status === 200 })) {
        return;
    }
    const usuarios = lista.json('users') || [];
    const indice = Math.floor(Math.random() * usuarios.length);
    const idUsuario = usuarios[indice]?.id;

    if (!check(idUsuario, {
        'La lista contiene un ID válido': (id) => Number.isInteger(id) && id >  0,
    })) {
        return;
    }

    //2 verificar el detalle usando el id
    const detalle = http.get(`${baseUrl}/users/${idUsuario}`);
    const idRecibido = detalle.status === 200 ? detalle.json('id') : undefined;
    check(detalle, { 'El detalle responde con HTTP 200': (r) => r.status === 200 });
    check(idRecibido, { 'El ID del detalle coincide con el extraído': (id) => id === idUsuario });

    console.log(`ID extraído de la lista: ${idUsuario} | ID recibido en el detalle: ${idRecibido}`);
}
