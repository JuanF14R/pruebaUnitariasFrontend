import { TestBed } from '@angular/core/testing';
import { Usuarios } from '../interfaces/usuarios';
import { UsuariosService } from './usuarios.service';
//Para poder probar peticiones HTTP debo importar a providehttpClient
import { provideHttpClient } from "@angular/common/http";
//Tambien debemos importar herramientas que permitan simular interacciones con mis peticiones HTTP. 
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";


describe('Pruebas para servicio de usuarios', () => {

  let service: UsuariosService;
  let _httpMock : HttpTestingController;//Mock = objeto o funcion falsa. -> Se crea para simular un comportamiento.
  const urlTestGet = "http://localhost:9000/usuarios/obtener";
  const urlTestPost = "http://localhost:9000/usuarios/crear";
  const testUser = {
    fullName: 'Juan Rodriguez',
    email: 'Juan@prueba.com',
    password: '123'
  }



  beforeEach(() => {
    TestBed.configureTestingModule({
     providers: [
      UsuariosService,
      provideHttpClient(),
      provideHttpClientTesting()
    ] });

    service = TestBed.inject(UsuariosService);
    _httpMock = TestBed.inject(HttpTestingController);

  });

  afterAll(() => {
    _httpMock.verify(); //Verficar que no queden peticiones pendientes
  });

    //Casos de prueba:

    //_______________________________________________________________
    //Caso 1 GET_______________________________________________________
    it('Debería hacer una petición GET para mostrar los usuarios', () => {
      const mockUsers = [
        {fullName: 'Juan Rodriguez', email: 'juan@prueba.com', password: '123'},
        {fullName: 'Juan Pinzon', email: 'pinzon@prueba.com', password: '123'}
      ];

      const mockRespuesta = {
        mensaje: "Se encontraron usuarios almacenados",
        numeroUsuarios: mockUsers.length,
        datos: mockUsers
      }

      service.getUsuarios().subscribe(
        (res) => {
          expect(res).toEqual(mockRespuesta);
        }
      );

      const peticion = _httpMock.expectOne(urlTestGet);

      expect(peticion.request.method).toBe('GET');

      peticion.flush(mockRespuesta);
    });

    //Caso 2 GET

    it('Deberia hacer una petición GET y decir que no hay usuarios en la base de datos', () => {

      const mockRespuesta = {
        "mensaje": "No hay usuarios almacenados"
      }

      service.getUsuarios().subscribe(
        (res) => {
          expect(res).toEqual(mockRespuesta);
        }
      );

      const peticion = _httpMock.expectOne(urlTestGet);

      expect(peticion.request.method).toBe('GET');

      peticion.flush(mockRespuesta);
    });

    //_____________________________________________________________

    //Caso 1 POST

    it('Debería hacer una petición POST para crear usuario', () => {

      const mockRespuesta = {
        mensaje: "Usuario creado correctamente",
        datos: testUser
      }

      service.postUsuarios(testUser).subscribe(
        (res) => {
          expect(res).toEqual(mockRespuesta);
        }
      );

      // garantizar que la petición se este haciendo a una URL en particular

      const peticion = _httpMock.expectOne(urlTestPost);
        
      //garantizar el metodo

      expect(peticion.request.method).toBe('POST');

      // ESTO ES LO QUE SIMULA LA RESPUESTA DEL SERVIDOR :

      peticion.flush(mockRespuesta);
    });
  
    //Caso 2 POST
    it('Debería hacer una petición POST y arrojar un error por no ingresar todos los campos requeridos', () => {

      const mockRespuesta = {
        mensaje: "Ocurrio un error al crear un usuario",
      }

      const testUserFallo = {
        fullName: 'Juan Rodriguez',
        email: 'Juan@prueba.com',
        password: ''
      }

      service.postUsuarios(testUserFallo).subscribe(
        (res) => {
          expect(res).toEqual(mockRespuesta);
        }
      );

      // garantizar que la petición se este haciendo a una URL en particular

      const peticion = _httpMock.expectOne(urlTestPost);
        
      //garantizar el metodo

      expect(peticion.request.method).toBe('POST');

      // ESTO ES LO QUE SIMULA LA RESPUESTA DEL SERVIDOR :

      peticion.flush(mockRespuesta);

    });

});
