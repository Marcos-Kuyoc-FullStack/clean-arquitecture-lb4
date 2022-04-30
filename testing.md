## Test Automáticos

Una parte impredecible en el desarrollo de software es la automatización de pruebas sobre el código, en este apartado veremos algunos ejemplos de las pruebas que se llevaron acabo en el desarrollo de las APIS y cómo podemos implementarlas.

### Test Funcionales

Los test funcionales hacen referencia a las pruebas que verifican el correcto funcionamiento del sistema o componentes de software. Es decir, valida que el código cumpla con las especificaciones que llegan de las reglas de negocio y que estén libres de ***bugs***. Dentro de esta categoría encontramos principalmente las siguientes:

- **Test Unitarios:** Este tipo de pruebas comprueban elementos básicos de nuestro software de forma aislada. Son los test más importantes a la hora de validar las reglas de negocio que hemos desarrollado.
- **Test de Integración:** Los test de integración son aquellos que prueban conjuntos de elementos básicos, normalmente suelen incluirse en este tipos de pruebas algunos elementos de infraestructura, como la base de datos o llamadas a APIS externas.
- **Test de Aceptación:** Este tipo de test, también denominados end-to-end o de extremo a extremo, prueban múltiples elementos de nuestra arquitectura simulando el comportamiento de un actor con nuestro software.

## Test Unitarios - Anatomia de los test unitarios

Como norma general , los test deben tener una estructura muy simple basada en las siguientes 3 partes:

- **Preparación (Arrange):** En esta parte del test preparamos el contexto para poder realizar la prueba. Por ejemplo, si probamos un método de una clase, primero tendremos que instanciar dicha clase para probarlo, Además una parte de la preparación puede estar contenida en el método BeforeEach(con Jest) si es común a todos los test de la clase.
- **Actuación(Act):** Ejecutamos la acción que queremos probar. Por ejemplo, invocar un método con unos parámetros.
- **Aserción(Assert):** Verificamos si el resultado de la acción es el esperado. Por ejemplo, el resultado de la invocación del método anterior tiene que devolver un valor determinado.

Siguiendo el ejemplo que se nos da en las reglas de negocio para “Validar que la contraseña sea lo suficientemente fuerte.” podemos crear unas prueba unitaria sencillas.

Prueba unitaria, usando Jest como framework de pruebas.

```jsx
describe('Pruebas unitarias - Validar que la contraseña sea lo suficientemente fuerte.', () => {
	test('Se espera que el password retorne una excepcion', () => {
		//Arrange
		const password = 'pa55'

		try {
			//Act
			validPassword(password);
		} catch(error) {
			//Assert
	    expect(error).toBeDefined();
      expect(error).toHaveProperty('message', 'La constraseña no es valida');
		}
	})

	test('Se espera que el password contenga letras, numeros, sea mayor a 8 caracteres, pero menor a 18', () => {
		//Arrange
		const password = 'pa55swordDeprueba'

		//Act
		const verifyPassword = validPassword(password);

		//Assert
    expect(verifyPassword).toBeDefined();
    expect(verifyPassword).toEqual(expect.any(String));
		expect(verifiPassword.length).toBeGreaterThanOrEqual(8)
		expect(verifyPassword).toMatch(/^[a-z0-9_-]{8,18}$/)
	})
})

validPassword = (password: string) => {
  if (password === 'pa55') {
		throw new Error('La constraseña no es valida')
  }

	// TODO
	return 'pa55swordDeprueba';
}

```

Existen otro tipo de test unitarios que tendremos que realizar estos son llamados **Test Dobles** los cuales veremos a continuación.

### Test dobles

Al igual que en el cine existe la figura del doble, que se hace pasar por un actor real, en los tests unitarios existen los dobles que se hacen pasar por dependencias reales. Dependiendo del tipo de trabajo que hacen reciben distintos nombres: *spy*, *stub*, *mock*… En los tests unitarios lo normal es usar *stubs*, que viene a ser crear la dependencia con un comportamiento predefinido para comprobar cómo se comporta el componente que estamos testeando, veamos de nuevo el ejemplo donde usamos la inyección de dependencias y la inversión de dependencias para desacoplar la clase *ExternalTask*.

Test Dobles para simular dependencias reales.

```jsx
import {createStubInstance, sinon} from '@loopback/testlab';

describe('Prueba Unitaria - Se prueba la clase UseCase que contiene una dependencia externa.', () => {
	test('Se espera que el método doSomenthing regrese un string válido', async() => {
		//Arrange
		const stubExternalService = createStupInstance(ExternalService);
    const doExternalTask = stubExternalService.stubs.doExternalTask as sinon.SinonStub;
	  doExternalTask.resolves('Doing external task...')

		//Act
		const client = new UseCase(stubExternalService);
		const result = await client.doSomenthing();

		//Asserts
		expect(doExternalTask.calledOnce).toEqual(true);
		expect(result).toBeDefined();
		expect(result).toBeEqual('Doing external task...')
	})
})

interface IExternalService{
	doExternalTask: async() => void;
}

class UseCase{
	constructor(private externalService: IExternalService){
	}

	async doSomenthing() {
		return this.externalService.doExternalTask();
	}
}

class ExternalService implements IExternalService {
	async doExternalTask() {
		return 'Doing external task...';
	}
}
```

Hemos visto las diferentes pruebas unitarias  y como podemos realizarlas apoyándonos de herramientas como Jest y Sinón esta ultima ya viene con el framework **Loopback 4** en el paquete **testlab.**

## Test de Integración

A diferencia de los tests unitarios, aquí ya no tenemos que falsear las dependencias porque justamente lo que se quiere es **comprobar que las dependencias están correctamente inyectadas**. Desde nuestro punto de vista hay que preguntarnos a que código se le aplicarían las pruebas de integración por lo cual se llego a la conclusión que se permite y que no:

### Se permite

- Acceder a base de datos, postgres, mongo, redis etc.
- Repositorios
- Controladores

### No se permite

- Colas de mensajerías
- Llamar a servicios externos(solamente se podría probar si son APIS REST usando axios)
- Acceder a servicios de difícil configuración

### Recomendaciones:

1. Probar el repositorio contra una base de datos real, en nuestro caso contra una base de datos en memoria.
2. Limpiar la base de datos antes y/o después de cada prueba.

Test Integración - Repositorio

```jsx
import {
  givenEmptyDatabase,
  givenCategory,
} from '../../helpers/database.helpers';
import {CategoryRepository} from '../../../repositories';
import {expect} from '@loopback/testlab';
import {testdb} from '../../fixtures/datasources/testdb.datasource';

describe('CategoryRepository (integration)', () => {
  beforeEach(givenEmptyDatabase);

  describe('findByName(name)', () => {
    test('Se espera que regrese la categoria correcta.', async () => {
			//Arrange
      const category = {name: 'estaciones'};

			//Act
			const repository = new CategoryRepository(testdb);
      const result = await repository.findByName('estaciones');

			// Asserts
      expect(result).toEqual(category);
			expect(result.name).toEqual(expect.any(String));
      expect(result.name).toEqual('estaciones');
    });
  });
});
```

Test Integración - Repositorios, Controladores y dependencias juntas

```jsx
import {expect} from '@loopback/testlab';
import {givenEmptyDatabase, givenProduct} from '../../helpers/database.helpers';
import {ProductController} from '../../../controllers';
import {ProductRepository} from '../../../repositories';
import {ProductService} from '../../../services';
import {testdb} from '../../fixtures/datasources/testdb.datasource';

describe('ProductController (integration)', () => {
  beforeEach(givenEmptyDatabase);

  describe('getDetails()', () => {
    test('Se espera, recuperar los detalles del producto dado', async () => {
			//Arrange
      const pencil = {name: 'Pencil', slug: 'pencil'};
			const productRepository = new ProductRepository(testdb);
			const productService = new ProductService(productRepository);
      const controller = new ProductController(productService);

			//Act
      const details = await controller.getDetails('pencil');

			//Asserts
      expect(details.slug).toContainEqual('pencil');
    });
  });
});
```

## Pruebas de Aceptación

Las pruebas de aceptación realizan las mismas acciones (envían las mismas solicitudes HTTP) que harán los clientes y consumidores de su API, y verifican que los resultados devueltos por el sistema coincidan con los resultados esperados.

### Recomendaciones:

1. Probar el repositorio contra una base de datos real, en nuestro caso contra una base de datos en memoria.
2. Limpiar la base de datos antes y/o después de cada prueba.

Prueba Integración - endpoint GET /api/ping

```jsx
import {Client} from '@loopback/testlab';
import {ApiApplication} from '../..';
import {setupApplication} from '../helpers/setupApplication';
import {loadData, emptyDatabase} from '../helpers/'

describe('Ping (Aceptacion)', () => {
  let app: ApiApplication;
  let client: Client;

  beforeAll(async () => {
    ({app, client} = await setupApplication());
		await loadData();
  });

  afterAll(async () => {
    await app.stop();
		await emptyDatabase();
  });

  test('exposes a default home page', async () => {
    const response = await client.get('/api/ping');

    expect(response.status).toEqual(200);
    expect(response.text).toBeDefined();
    expect(response.text).toEqual(expect.any(String));
  });
});
```

## TDD - Test Driven Development

Test Driven Development (TDD), o desarrollo dirigido por test, es una técnica de ingeniería de software para, valga la redundancia, diseñar software. Como su propio nombre indica, esta técnica dirige el desarrollo de un producto a través de ir escribiendo pruebas, generalmente unitarias.

### **Las tres leyes del TDD**

Robert C. Martin describe la esencia del TDD como un proceso que atiende a las siguientes tres reglas:

- No escribirás código de producción sin antes escribir un test que falle.
- No escribirás más de un test unitario suficiente para fallar.
- No escribirás más código del necesario para hacer pasar el test.

**El ciclo Red-Green-Refactor**

El ciclo Red-Green-Refactor, también conocido como algoritmo del TDD, se basa en:

- **Red:** Escribir un test que falle, es decir, tenemos que realizar el test antes de escribir la implementación. Normalmente se suelen utilizar test unitarios, aunque en algunos contextos puede tener sentido hacer TDD con test de integración.
- **Green:** Una vez creado el test qué falla, implementaremos el mínimo código necesario para que el test pase.
- **Refactor:** Por último, tras conseguir que nuestro código pase el test, debemos examinarlo para ver si hay alguna mejora que podamos realizar.
- Una vez que hemos cerrado el ciclo, empezamos de nuevo con el siguiente requisito.

### Recomendaciones:

1. Escogemos un requisito.
2. Escribimos un test que falla.
3. Creamos la implementación mínima para que el test pase.
4. Ejecutamos todos los tests.
5. Refactorizamos.
6. Actualizamos la lista de requisitos.

# Alcance de las pruebas

Otro de los aspectos que tendremos que concretar a la hora de definir nuestra arquitectura de Software es cómo enfocaremos el testing.

![Untitled](Documentacio%CC%81n%20Arquitectura%20de%20Software%205e204d122a404caf872ceb26d25650ce/Untitled.png)

- Test unitarios: Capa de Aplicación y Dominio (Servicios de aplicación y  Servicios de Dominio)
- Test de integración: Capa de Infraestructura (Repositorios, Controladores)
- Test de Aceptación: Todas las capas

## Commits

Para los distintos commit usaremos “Commits Convencionales”.

[Commits Convencionales](https://www.conventionalcommits.org/es/v1.0.0/)

Para lograr esto agregamos la siguiente librería al proyecto.

```bash
 > yarn add -D git-commit-msg-linter
```

## **Documentación de la API**

Loopback 4 nos proporcionar una manera sencilla para documentar la API integrando swagger UI

# Deploys

Para los deploys usamos pipelines de bitbucket para hacer los despliegues a AWS a dependiendo de las ramas de producción y de staging.
