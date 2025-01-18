import { TestBed } from '@angular/core/testing';
import { Productos } from '../interfaces/productos';
import { ProductosService } from './productos.service';
//Para poder probar peticiones HTTP debo importar a providehttpClient
import { provideHttpClient } from "@angular/common/http";
//Tambien debemos importar herramientas que permitan simular interacciones con mis peticiones HTTP. 
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";



describe('Pruebas para servicio de productos', () => {

  let service: ProductosService;
  let _httpMock: HttpTestingController;//Mock = objeto o funcion falsa. -> Se crea para simular un comportamiento.
  // let productModel : Productos;
  const urlTestGet = "http://localhost:9000/productos/obtener";
  const urlTestPost = "http://localhost:9000/productos/crear";
  const urlTestPut = "http://localhost:9000/productos/actualizar/";
  const urlTestDelete = "http://localhost:9000/productos/eliminar/";

  const mockProduct: any = {
    image: "img1", name: "camisa1", category: "mujer", color: "Verde", talla: "M", price: "10000", stock: "2", _id: 'lkfsldk135'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductosService);
    _httpMock = TestBed.inject(HttpTestingController);


  });

  afterAll(() => {
    _httpMock.verify();
  });

  //Casos de prueba:

  //______________________________________________________________________

  //Caso 1 GET

  it('Debería hacer una petición GET para mostrar los productos', () => {
    const mockRespuesta = {
      "mensaje": "Esto son todos las camisetas encontradas",
      "datos": mockProduct
    }

    service.getProductos().subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestGet);

    expect(peticion.request.method).toBe('GET');

    peticion.flush(mockRespuesta);
  });

  //Caso 2 GET

  it('Debería hacer una petición GET y decir que no hay productos en la base de datos', () => {

    const mockRespuesta = {
      mensaje: "No se encontraron camisetas en la base de datos"
    }

    service.getProductos().subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestGet);

    expect(peticion.request.method).toBe('GET');

    peticion.flush(mockRespuesta);

  });

  //___________________________________________________________________

  //Casi 1 POST

  it('Deberia hacer un petición POST para crear un producto', () => {
    const mockRespuesta = {
      mensaje: "La camiseta se creo correctamente :)",
      datos: mockProduct
    }

    service.postProductos(mockProduct).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );


    const peticion = _httpMock.expectOne(urlTestPost);

    //garantizar el metodo

    expect(peticion.request.method).toBe('POST');

    // ESTO ES LO QUE SIMULA LA RESPUESTA DEL SERVIDOR :

    peticion.flush(mockRespuesta);

  });

  // Caso 2 POST

  it('Debería hacer una petición POST y arrojar un error por no ingresar todos los campos requeridos', () => {
    const mockRespuesta = {
      mensaje: "Ocurrio un error al crear una camiseta :("
    }

    const mockProductFallo = {
      image: "", name: "camisa", category: "mujer", color: "Verde", talla: "M", price: "10000", stock: "2"
    }

    service.postProductos(mockProduct).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );


    const peticion = _httpMock.expectOne(urlTestPost);

    //garantizar el metodo

    expect(peticion.request.method).toBe('POST');

    // ESTO ES LO QUE SIMULA LA RESPUESTA DEL SERVIDOR :

    peticion.flush(mockRespuesta);
  });

  //_______________________________________________________________

  //Caso 1 PUT

  it('Deberia hacer una petición PUT para actualizar un producto correctamente', () => {

    const productoId = 'lkfsldk135';

    const productoActualizar: any = {
      image: "img1", name: "camisa3", category: "mujer", color: "Verde", talla: "M", price: 10000, stock: 2
    }

    const mockRespuesta = {
      "mensaje": "Se actualizo la camiseta correctamente",
      "datos": productoActualizar
    }

    service.putProductos(productoId, productoActualizar).subscribe(
      (res) => {
        expect(res).toEqual(productoActualizar);
      }
    );

    const peticion = _httpMock.expectOne(urlTestPut + productoId);

    expect(peticion.request.method).toBe('PUT');

    peticion.flush(mockRespuesta.datos);

  });

  //Caso 2 PUT

  it('Debería hacer una petición PUT y arrojar un error de id de producto incorrecto', () => {

    const productoAEditar: any = mockProduct;
    const productId = '123abcd456';

    const mockRespuesta = {
      "mensaje": "Lo siento!!! No se encontró alguna camistea para actualizar"
    }

    service.putProductos(productId, productoAEditar).subscribe(
      (res) => {
        expect(res).toBe(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestPut + productId);

    expect(peticion.request.method).toBe('PUT');

    peticion.flush(mockRespuesta);
  });


  //Caso 3 PUT

  it('Debería hacer una petición PUT y arrojar error por no ingresar id valido', () => {

    const productoAEditar: any = mockProduct;
    const productId = '';

    const mockRespuesta = {
      "mensaje": "Ocurrio un error al actualizar la camiseta"
    }

    service.putProductos(productId, productoAEditar).subscribe(
      (res) => {
        expect(res).toBe(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestPut + productId);

    expect(peticion.request.method).toBe('PUT');

    peticion.flush(mockRespuesta);

  })

  //_____________________________________________________________________________________________________-

  //Caso 1 petición DELETE

  it('Deberia hacer una petición DELETE y eliminar correctamente un producto', () => {

    const productoId = 'lkfsldk135';
    const productoAEliminar = mockProduct;

    const mockRespuesta = {
      mensaje: "Camiseta  eliminada correctamente"
    }

    service.deleteProductos(productoId).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestDelete + productoId);

    expect(peticion.request.method).toBe('DELETE');

    peticion.flush(mockRespuesta);
  });

  //Caso 2 petición DELETE

  it('Debería hacer una petición DELETE y arrojar error al no reconocer un id existente', () => {

    const productoId = 'lkfsldk1351234';
    const productoAEliminar = mockProduct;

    const mockRespuesta = {
      "mensaje": "Ocurrio un error al eliminar la camiseta",
    }

    service.deleteProductos(productoId).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestDelete + productoId);

    expect(peticion.request.method).toBe('DELETE');

    peticion.flush(mockRespuesta);

  });

});
