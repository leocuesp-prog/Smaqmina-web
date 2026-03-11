drop database if exists smaqmina1;
create database  smaqmina1;
use smaqmina1;
CREATE TABLE usuario (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
correo varchar(200) UNIQUE NOT NULL,
telefono VARCHAR(20),
password VARCHAR(255) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
create table herramienta_sujecion (
id_herramienta_sujecion int(20) primary key  unique auto_increment,
nombre_herramienta_sujecion varchar(45) not null,
cantidad_buena_sujecion decimal(11) not null,
cantidad_regular_sujecion  decimal(11) not null,
cantidad_mala_sujecion  decimal(11) not null
);
create table herramienta_corte (
id_herramienta_corte int(20) primary key  unique auto_increment,
nombre_herramienta_corte varchar(45) not null,
cantidad_buena_corte decimal(11) not null,
cantidad_regular_corte  decimal(11) not null,
cantidad_mala_corte  decimal(11) not null
);
create table herramienta_medicion (
id_herramienta_medicion int(20) primary key  unique auto_increment,
nombre_herramienta_medicion varchar(45) not null,
cantidad_buena_medicion decimal(11) not null,
cantidad_regular_medicion  decimal(11) not null,
cantidad_mala_medicion  decimal(11) not null
);
create table herramienta_impacto (
id_herramienta_impacto int(20) primary key  unique auto_increment,
nombre_herramienta_impacto varchar(45) not null,
cantidad_buena_impacto decimal(11) not null,
cantidad_regular_impacto  decimal(11) not null,
cantidad_mala_impacto  decimal(11) not null
);
create table maquina (
id_maquina varchar(20) primary key not null,
nombre_maquina varchar(45) not null,
marca_maquina varchar(45),
modelo_maquina varchar(45) not null,
garantia_maquina decimal(11) ,
uso_maquina varchar(100),
operado_por_maquina varchar(45),
empresa_maquina varchar(45),
proceso_maquina varchar(45),
lugar_trabajo_maquina varchar(45),
ubicacion_maquina varchar(45) not null,
ciudad_maquina varchar(45),
fecha_maquina date not null,
maquina_en_operacion enum("si","no") not null,
responsable_maquina varchar(45) not null,
codigo_programa_man_maquina varchar(19) not null,
descripcion_maquina text 
);
create table equipo (
id_equipo varchar(20) primary key not null,
nombre_equipo varchar(45) not null,
marca_equipo varchar(45),
modelo_equipo varchar(45) not null,
garantia_equipo decimal(11) ,
uso_equipo varchar(45),
operado_por_equipo varchar(45),
empresa_equipo varchar(45),
proceso_equipo varchar(45),
lugar_trabajo_equipo varchar(45),
ubicacion_equipo varchar(45) not null,
ciudad_equipo varchar(45),
fecha_equipo date not null,
equipo_en_operacion enum("si","no") not null,
responsable_equipo varchar(45) not null,
codigo_programa_man_equipo decimal(11) not null,
descripcion_equipo text 
);
CREATE TABLE mantenimiento_maquina (
codigo_mantenimiento_maquina INT NOT NULL PRIMARY KEY auto_increment,
tipo_mantenimiento_maquina enum("preventivo","correctivo","predictivo")NOT NULL,
fecha_mantenimiento_maquina DATE NOT NULL,
observacion_maquina text NOT NULL,
equipo_apto_maquina enum("si","no") not null,
realizo_mantenimiento_maquina varchar(45) NOT NULL,
reviso_mantenimiento_maquina VARCHAR(45) NOT NULL,
novedad_maquina VARCHAR(45) not null,
id_maquina varchar(11),
foreign key(id_maquina)references maquina(id_maquina)
);
CREATE TABLE mantenimiento_equipo (
codigo_mantenimiento_equipo INT NOT NULL PRIMARY KEY auto_increment,
tipo_mantenimiento_equipo enum("preventivo","correctivo","predictivo")NOT NULL,
fecha_mantenimiento_equipo DATE NOT NULL,
observacion_equipo text NOT NULL,
equipo_apto_equipo enum("si","no") not null,
realizo_mantenimiento_equipo varchar(45) NOT NULL,
reviso_mantenimiento_equipo VARCHAR(45) NOT NULL,
novedad_equipo VARCHAR(45) not null,
id_equipo varchar(11),
foreign key(id_equipo)references equipo(id_equipo)
);
INSERT INTO equipo (
id_equipo,
nombre_equipo,
marca_equipo,
modelo_equipo,
garantia_equipo,
uso_equipo,
operado_por_equipo,
empresa_equipo,
proceso_equipo,
lugar_trabajo_equipo,
ubicacion_equipo,
ciudad_equipo,
fecha_equipo,
equipo_en_operacion,
responsable_equipo,
codigo_programa_man_equipo,
descripcion_equipo
) values('EQ001',
'Malacate',
'STROPO',
'M-30-01',
24,
'Transporte y descargue',
'Tecnicos mina',
'Sena Centro minero',
'Tunel 2',
'Planta Principal',
'Tunel 2',
'sogamoso',
'2026-03-10',
'si',
'jefe mina',
1001,
'Equipo utilizado para supervisar procesos industriales en la planta.'
);
INSERT INTO maquina (
id_maquina,
nombre_maquina,
marca_maquina,
modelo_maquina,
garantia_maquina,
uso_maquina,
operado_por_maquina,
empresa_maquina,
proceso_maquina,
lugar_trabajo_maquina,
ubicacion_maquina,
ciudad_maquina,
fecha_maquina,
maquina_en_operacion,
responsable_maquina,
codigo_programa_man_maquina,
descripcion_maquina
)
VALUES (
'TI-BT01',
'Banda transportadora',
'Davis or Divan',
'1992',
12,
'Transporte de material de un punto a otro desde una inclinación determinada',
'Técnicos mina',
'Sena Centro Minero',
'Mantenimiento',
'Túnel 1',
'Sena Centro Minero - Mina didactica',
'Sogamoso',
'2023-03-10',
'No',
'Jefe de mina',
'TI-BT01',
'Banda transportadora, no está en uso'
)