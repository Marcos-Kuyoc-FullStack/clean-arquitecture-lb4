# Started Kit - Clean Arquitecture use LoopBack 4

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
yarn install
```

## Run the application

```sh
yarn start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
yarn run build
```

To force a full build by cleaning up cached artifacts:

```sh
yarn run rebuild
```

## Fix code style and formatting issues

```sh
yarn run lint
```

To automatically fix such issues:

```sh
yarn run lint:fix
```

## Other useful commands

- `yarn run migrate`: Migrate database schemas for models
- `yarn run openapi-spec`: Generate OpenAPI spec into a file
- `yarn run docker:build`: Build a Docker image for this application
- `yarn run docker:run`: Run this application inside a Docker container

## Tests

```sh
yarn test
```


# Documentación Arquitectura de Software

# Introducción

Uno de los problemas principales a la hora de construir software es definir la estructura del código fuente y solventar el problema de la escalabilidad, es por ello que en este documento definiremos la **arquitectura de software** a usar.  La intención es mostrar esas buenas prácticas que han hecho que nuestro código sea más **flexible**, más fácil de **entender** y de **testear** a la hora de construir las diferentes APIs.

## Aprendizaje

El desarrollo de  distintas APIS me llevo a encontrar el camino hacia las arquitecturas limpias(**Clean Arquitecture**), sin embargo en el proceso cometimos varios errores que nos hicieron aprender e ir transitando a este tipos de metodologías, a continuación conoceremos algunos conceptos claves para entender y no cometer los mismos errores.

# Teoría de la arquitectura del código

![https://miro.medium.com/max/700/1*yR4C1B-YfMh5zqpbHzTyag.png](https://miro.medium.com/max/700/1*yR4C1B-YfMh5zqpbHzTyag.png)

![https://xurxodev.com/content/images/2016/07/CleanArchitecture-8b00a9d7e2543fa9ca76b81b05066629.jpg](https://xurxodev.com/content/images/2016/07/CleanArchitecture-8b00a9d7e2543fa9ca76b81b05066629.jpg)

![https://code2read.files.wordpress.com/2015/07/onion-architecture.png?w=700](https://code2read.files.wordpress.com/2015/07/onion-architecture.png?w=700)

*Hexagonal Arquitecture*, *Clean Arquitecture* y *Onion Arquitecture* son los diferentes tipos de arquitecturas mas conocidas y aunque parezcan diferentes cada una de ellas trata de los mismo, organizar el código de la la aplicación de forma que se separe bien la **lógica de negocio** del **código de infraestructura**

Con esta idea en mente podemos plantearnos un caso de uso y comenzar a trabajar en los requerimientos.

### Caso de uso #1  (Crear un nuevo usuario)

1. Comprobar que no haya otro usuario con el mismo email.
2. Validar que la contraseña sea lo suficientemente fuerte.
3. Almacenar o persistir los datos del usuario.
4. Enviar un email de bienvenida.

Todo el código generado para que se cumpla el *caso de uso* se conoce como código de **lógica de negocio** o también llamado del **dominio de la aplicación**, pero todos los detalles de como se persiste los datos del usuario(BD), o cómo se envía el email de bienvenida (Sendgrid, Mandrill, SES, etc) es **código de infraestructura.**

La razón detrás de esta separación está muy clara: Cambiar la forma de enviar los correos o de persistir los usuarios no debe afectar la lógica de nuestra aplicación.

![https://ivanguardado.com/assets/images/domain-infrastructure-1.png](https://ivanguardado.com/assets/images/domain-infrastructure-1.png)

### ¿Cómo se logra el objetivo si quisiéramos cambiar nuestra DB de postgres o mongo?

La solución a este problema es que el código del dominio **exponga interfaces,** de forma que se establece una vía de comunicación con las capas mas externas. El código del dominio extiende solamente de interfaces expuestas, por lo que son las ***clases externas*** las que implementan las interfaces, a estas clases externas se le conoce como ***Adapters(Adaptadores)***.

![https://ivanguardado.com/assets/images/domain-infrastructure-2.png](https://ivanguardado.com/assets/images/domain-infrastructure-2.png)

# El Dominio

Aunque la separación entre el dominio y la infraestructura es la mas natural, dentro de el dominio tenemos que organizar de la mejor forma posible toda la lógica del negocio y para esto usamos los principios SOLID de forma que sea fácil de leer, cambiar y sobre todo testear nuestra aplicación. Dentro del dominio se suelen dividir en diferentes capas, las mas conocidas están: **Objetos del dominio** *(Entity Model)*, **Interfaces de Repositorios** y **Servicios de la Aplicación**.

### Objetos del dominio

Son las clases, objetos, valores, eventos, tipos etc que componen el núcleo del dominio. Uno de los tipos de objeto de dominio más importante son las **entidades**, que son objetos con una identidad única que representan una parte importante del negocio. Por ejemplo los usuarios, roles, clientes, productos, descuentos etc.

### Interfaces de repositorios

Son las diferentes interfaces expuestas que funciona como puente de comunicación con los diferentes adaptadores o clases concretas que implementan dichas interfaces.

## Servicios de la Aplicación

Son los **casos de usos reales** que definen la aplicación y son el punto de entrada desde fuera del framework a nuestra lógica de negocio, si queremos conectar nuestro dominio con un servicio web como express o a través de otro servicio este seria el punto de entrada, nunca por los objetos del dominio o los repositorios.

En el ejemplo de uso de express seria a través de los controladores que llamaríamos a los diferentes servicios de la aplicación.

Para ayudarnos con esta parte y agilizar el proceso de construcción de nuestras apis se usa el framework **Loopback 4** ya que tiene incluido en su core las 3 capas de dominio mencionadas antes y la capa de infraestructura que incluye los controladores y los diferentes adaptadores de base de datos(datasources).

# Regla de dependencia

Ahora que hemos visto las diferentes capas en que debemos dividir nuestro código de dominio, podemos representar su jerarquía como un conjunto de capas concéntricas donde las capas más cercanas al centro representan el modelo de nuestro negocio, y las capas más exteriores representan detalles de la implementación de la infraestructura.

![arquitectura-componente.jpg](Documentacio%CC%81n%20Arquitectura%20de%20Software%205e204d122a404caf872ceb26d25650ce/arquitectura-componente.jpg)

Para mantener todo el código desacoplado necesitamos seguir la regla de dependencia, que dice que **las capas interiores no pueden conocer nada sobre las capas exteriores**. Es decir, una entidad no puede conocer y usar un servicio de aplicación etc., sin embargo el flujo contrario está permitido, por ejemplo, un servicio de aplicación orquesta el flujo de repositorios y/o entidades, o un endpoint del framework llamará a un servicio de aplicación.

En algunos casos podemos necesitar dependencias de infraestructura dentro de nuestro dominio. Eso se soluciona exponiendo interfaces o (puertos) de forma que **invertimos el flujo de dependencia,** cumpliendo con lo que nos dice esta regla. A esta técnica se le conoce como inversión de control(IoC *inversion of Control*)

### Inyección de dependencias(DI)

La inyección de dependencias es un patrón de diseño que nos va a permitir realizar la inversión de control en nuestro código. La idea consiste en qué las **dependencias son especificadas externamente** en lugar de requerirse explícitamente en el código. En otro sentido es un patrón de diseño que se encarga de extraer la responsabilidad de la creación de instancias de un componente para delegar a otro.

Loopback 4 ya integra la Inyección de dependencias(DI) así mismo la inversión de control(IoC) que podemos usar de forma inmediata.

Ejemplos:

Código acoplado con dependencia oculta

```tsx
class UseCase {
	constructor() {
		this.externalService = new ExternalService();
	}

	doSomenthing() {
		this.externalService.doExternalTask();
	}
}

class ExternalService {
	doExternalTask() {
		console.log('Doing task...');
	}
}

const client = new UseCase();
client.doSomenthing();
```

En este caso nos encontramos con un caso de alto acoplamiento, ya que la clase *UseCase* tiene una **dependencia oculta** de la clase *ExternalService.* Si, por algún motivo tuviéramos que cambiar la implementación de la clase ExternalService, la funcionalidad de la clase UseCase podría verse afectada.  ¿Te imaginas la pesadilla que esto supone a nivel de mantenimiento en un proyecto real? para lidiar con esta problemática debemos empezar por aplicar el **patrón de inyección de dependencias**.

Código acoplado, con dependencia visible

```tsx
class UseCase{
	constructor(private externalService: ExternalService) {
	}

	doSomenthing() {
		this.externalService.doExternalTask();
	}
}

class ExternalService {
	doExternalTask() {
		console.log('Doing task...');
	}
}

const externalService = new ExternalService();
const client = new UseCase(externalService);
client.doSomenthing();
```

Ya está, así de sencillo, esto de inyectar la dependencia vía constructor, que también se podría hacer vía método **setter.** Ahora, aunque seguimos teniendo un grado de acoplamiento alto, la dependencia es visible, con lo cual ya nos queda más clara la relación entre las clases.

### Aplicando Inversión de dependencias(DIP)

En nuestro ejemplo seguimos teniendo un grado de acoplamiento alto, ya que la clase *UseCase* hace uso de una implementación concreta de *ExternalService.* Lo ideal aquí es que la clase cliente (*UseCase*) dependa de una abstracción(*interfaz*) que defina el contrato que necesita, en este caso *doExternalTask(),* es decir, la clase menos importante *ExternalService*, debe adaptarse a las necesidades de la clase más importante, *UseCase*.

Código desacoplado, con la dependencia invertida

```tsx
interface IExternalService{
	doExternalTask: () => boolean;
}

class UseCase {
	constructor(private externalService: IExternalService){
	}

	doSomenthing() {
		this.externalService.doExternalTask();
	}
}

class ExternalServiceSendToEmailSendgrid implements IExternalService {
	doExternalTask() {
    // more task
    // sendgrid
		return true;
	}
}

class ExternalServiceSendToEmailMailcheap implements IExternalService {
	doExternalTask() {
    // more task
    // mailcheap | otro servicio de correo
		return true;
	}
}

const externalService1 = new ExternalServiceSendToEmailSendgrid();
const externalService2 = new ExternalServiceSendToEmailMailcheap()
const client = new UseCase(externalService2);
client.doSomenthing();
```

Ahora el código de la clase *UseCase* está totalmente desacoplado de la clase *ExternalService* y tan solo depende de una interfaz creada en base a sus necesidades, con lo cual podemos decir que hemos invertido la dependencia, esta ventaja significativa nos ayuda a tener el código mas entendible y fácil de testear.

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
