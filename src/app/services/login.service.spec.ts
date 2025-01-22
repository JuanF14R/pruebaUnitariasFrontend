import { TestBed } from '@angular/core/testing';
import { CredencialesAdmin } from '../interfaces/credenciales-admin';
import { Credenciales } from '../interfaces/credenciales';
import { CredencialesAdminService } from './login.service';
//Para poder probar peticiones HTTP debo importar a providehttpClient
import { provideHttpClient } from "@angular/common/http";
//Tambien debemos importar herramientas que permitan simular interacciones con mis peticiones HTTP. 
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';


describe('Prueba LoginService', () => {
  
  let _mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  let _mockToastrService = jasmine.createSpyObj('ToastrService', ['info']);
  let service: CredencialesAdminService;
  let _httpMock : HttpTestingController;
  // let _ToastrService : ToastrService;

  const urlTestuser = "http://localhost:9000/iniciarSesion/";
  const urlTestAdmin = "http://localhost:9000/inicarSesionAdmin/";

  const userTest : Credenciales = {
  emailLoginUser: 'prueba@prueba.com',
  passwordLoginUser: '123'
  }

  const adminTest : CredencialesAdmin = {
    emailLoginAdmin: 'admin@prueba.com',
    passwordLoginAdmin : '456'
  }
  const tokenTest = 'fgaf6g54f6565';
  const tokenAdmin = 'gdfgdeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDE0NGZhMzViOWM4ZGU4MzM0OWJjMyIsIm5hbWUiOiJQcnVlYmEgZGUgYXV0ZW50aWNhY2nDs24iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MzQ1NzE3NTUsImV4cCI6MTczNDU3ODk1NX0.gS-tGOZoUQVswkmLOtXqvHUA0iVbPyfOOXvlwxFhTF0'
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [ToastrModule.forRoot()], 
      providers: [
        CredencialesAdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: ToastrService, useValue: _mockToastrService},
        {provide: Router, useValue: _mockRouter}
      ]   
    });
    service = TestBed.inject(CredencialesAdminService);
    _httpMock = TestBed.inject(HttpTestingController);
  });

 afterAll(() => {
  _httpMock.verify();

 });


 //CASOS DE PRUEBA

 //Inicio sesión USUARIOS

  it('Debería hacer una petición POST para INICIAR SESIÓN usuarios', () => {

    const mockRespuesta = {
      mensaje: "Inicio de sesion exitoso",
      tokenGenerado: tokenTest
    }

    const datosUsuario : Credenciales = userTest;

    service.inicioSesionUsuario(datosUsuario).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestuser);

    expect(peticion.request.method).toBe('POST');

    peticion.flush(mockRespuesta);
  });

  // INICIO Sesión ADMINISTRADORES

  it('Debería hacer una petición POST para INICIAR SESIÓN administradores', () => {

    const mockRespuesta = {
      mensaje: "Inicio de sesion exitoso",
      tokenGenerado: tokenTest
    }

    const datosAdmin : CredencialesAdmin = adminTest;

    service.inicioSesionAdmin(datosAdmin).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestAdmin);

    expect(peticion.request.method).toBe('POST');

    peticion.flush(mockRespuesta);
  });


  // Fallo inicio sesión USUARIOS
  it('Deberia hacer una petición POST para iniciar sesión y arrojar error por no encontrar el usuario', () => {

    const mockRespuesta = {
     "mensaje": "El usuario no se encontro, por favor registrese"
    }

    const datosUsuario : Credenciales = {
      emailLoginUser: '',
      passwordLoginUser: '64654'
    };

    service.inicioSesionUsuario(datosUsuario).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestuser);

    expect(peticion.request.method).toBe('POST');

    peticion.flush(mockRespuesta);
  });


  //Fallo inicio de sesion Admin

  it('Debería hacer una petición POST y arrojar error por no encontrar el administrador', () =>{

    const mockRespuesta = {
     mensaje: "Administrador no encontrado, por favor verifica correo y contraseña"
    }

    const datosAdmin : CredencialesAdmin = {
      emailLoginAdmin: '',
      passwordLoginAdmin: '456'
    }

    service.inicioSesionAdmin(datosAdmin).subscribe(
      (res) => {
        expect(res).toEqual(mockRespuesta);
      }
    );

    const peticion = _httpMock.expectOne(urlTestAdmin);

    expect(peticion.request.method).toBe('POST');

    peticion.flush(mockRespuesta);

  });

  //_______________________________________________
  //Caso de prueba para obetener el token 
  it('Deberia obtener el token almacenado en el localStorage', () => {
    localStorage.setItem('token', tokenTest);

    expect(service.obtenerToken()).toBe(tokenTest);
  });

  //Caso de prueba verificar si ests Loggueado 

    it('Debería verificar si el USUARIO/ADMIN esta logueado', () => {

      localStorage.setItem('token', tokenTest);
      expect(service.estaLogueado()).toBeTrue();
    });

    //Caso de prueba verificar el cierre de sesión
    it('Debería cerrar sesión', () => {
      service.cierreSesion();
      expect(localStorage.getItem('token')).toBeNull();
    });

    //Caso de prueba verificar si es Admin

    it('Deberia verificar si es Admin', () => {

      localStorage.setItem('token', tokenAdmin);
      expect(service.esAdmin()).toBeTrue();
     


    });


    //Caso de prueba redireccionar

    it('Deberia redireccionar si es Admin a Dashboard', () => {


      spyOn(service, 'esAdmin').and.returnValue(true);

      
      // const isAdmin = true;

      service.redireccionar();
      expect(_mockRouter.navigate).toHaveBeenCalledWith(['/DashBoard']);


    });
    

 
});
