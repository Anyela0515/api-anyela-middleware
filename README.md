# api-anyela

API realizada con Express y TypeScript
Se configuro el proyecto con modulos ES y se agregaron dos middlewares. El primero registra las peticiones que llegan al servidor y el segundo valida el header x-api-key.

# Instalacion
npm install
# Ejecutar el servidor
npm run dev

El servidor se levanta en el puerto 3000.

http://localhost:3000
# API Key

La clave usada para las pruebas fue:

secreto-demo

Se envia en el header:

x-api-key: secreto-demo

# Pruebas
1. Sin API key

Comando:

curl http://localhost:3000/health

Salida:

curl : {"code":401,"error":"API key inválida o ausente"}

No se envio la clave, por eso la respuesta fue 401.

2. Con API key valida

Comando:

curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/health

Salida:

{"code":200,"status":"API saludable","timestamp":"2026-06-12T02:21:54.076Z"}

Con la clave correcta la ruta /health responde con codigo 200.

3. Ruta inexistente

Comando:

curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/noexiste

Salida:

{"code":404,"error":"Ruta no encontrada"}

La clave era valida, pero la ruta no existe, por eso responde 404.

# Verificacion
npx tsc --noEmit

El comando se ejecuto sin errores.



En esta parte del PE-2.1 agregue pruebas unitarias con Jest para comprobar que los middlewares funcionen correctamente sin levantar el servidor.

Para esto cree y configure los archivos necesarios para las pruebas:

jest.config.ts
src/middlewares/auth.test.ts
src/middlewares/logger.test.ts

Tambien modifique el package.json para agregar el script:

"test": "jest"

Las pruebas realizadas fueron para el middleware de autenticacion y para el logger. En auth.test.ts se valido que la API key sea obligatoria y que solo permita continuar cuando la clave sea correcta. En logger.test.ts se comprobo que el middleware registre la peticion y continue con next().

Para ejecutar las pruebas use el comando:

npm test

Resultado obtenido:

PS C:\Users\User\Downloads\api-anyela\api-anyela> npm test

> api-anyela@1.0.0 test
> jest

 PASS  src/middlewares/auth.test.ts
 PASS  src/middlewares/logger.test.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        2.63 s, estimated 3 s
Ran all test suites.