-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-10-31 22:35:50.815

-- tables
-- Table: categoria
CREATE TABLE categoria (
    idcategoria SERIAL PRIMARY KEY,
    tipo varchar(30),
    descripcion varchar(150)
);

-- Table: detalle_pedido
CREATE TABLE detalle_pedido (
    iddetalle SERIAL PRIMARY KEY,
    cantidad int,
    idplato int,
    idpedido int,
    idreserva int
);

-- Table: mesa
CREATE TABLE mesa (
    idmesa SERIAL PRIMARY KEY,
    capacidad int,
    nombre varchar(255),
    posx real,
    posy real,
    visible boolean
);

-- Table: oferta
CREATE TABLE oferta (
    idoferta SERIAL PRIMARY KEY,
	src varchar(120),
    titulo varchar(70),
    requerimiento varchar(100),
    descripcion varchar(70),
    fecha_inicio date,
    fecha_fin date,
    descuento int,
    idplato int
);

-- Table: pago
CREATE TABLE pago (
    idpago SERIAL PRIMARY KEY,
    fecha int,
    monto real,
    idpedido int,
    idusuario int
);

-- Table: pedido
CREATE TABLE pedido (
    idpedido SERIAL PRIMARY KEY,
    fecha date,
    hora time,
    estado int,
    idusuario int,
    precio_total real
);

-- Table: platillo
CREATE TABLE platillo (
    idplato SERIAL PRIMARY KEY,
    nombre varchar(100),
    descripcion varchar(200),
    precio real,
    idcategoria int,
    imagen varchar(100),
    estado int
);

-- Table: resenia
CREATE TABLE resenia (
    idresenia SERIAL PRIMARY KEY,
    puntuacion int NOT NULL,
	fecha date NOT NULL,
    idusuario int,
    idplato int
);

-- Table: reserva
CREATE TABLE reserva (
    idreserva SERIAL PRIMARY KEY,
    fecha date ,
    hora time ,
    estado int,
    idusuario int,
    idmesa int
);

-- Table: rol
CREATE TABLE rol (
    idrol SERIAL PRIMARY KEY,
    rol varchar(25)
);

-- Table: usuario
CREATE TABLE usuario (
    idusuario SERIAL PRIMARY KEY,
    nombre varchar(255) NOT NULL,
    apellidos varchar(255) NOT NULL,
    correo varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    idrol int NOT NULL,
    activo boolean
);

-- foreign keys
-- Reference: detalle_pedido_pedido (table: detalle_pedido)
ALTER TABLE detalle_pedido ADD CONSTRAINT detalle_pedido_pedido
    FOREIGN KEY (idpedido)
    REFERENCES pedido (idpedido)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: detalle_pedido_platillo (table: detalle_pedido)
ALTER TABLE detalle_pedido ADD CONSTRAINT detalle_pedido_platillo
    FOREIGN KEY (idplato)
    REFERENCES platillo (idplato)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: detalle_pedido_reserva (table: detalle_pedido)
ALTER TABLE detalle_pedido ADD CONSTRAINT detalle_pedido_reserva
    FOREIGN KEY (idreserva)
    REFERENCES reserva (idreserva)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: pago_pedido (table: pago)
ALTER TABLE pago ADD CONSTRAINT pago_pedido
    FOREIGN KEY (idpedido)
    REFERENCES pedido (idpedido)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: pago_usuario (table: pago)
ALTER TABLE pago ADD CONSTRAINT pago_usuario
    FOREIGN KEY (idusuario)
    REFERENCES usuario (idusuario)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: pedido_usuario (table: pedido)
ALTER TABLE pedido ADD CONSTRAINT pedido_usuario
    FOREIGN KEY (idusuario)
    REFERENCES usuario (idusuario)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: platillo_categoria (table: platillo)
ALTER TABLE platillo ADD CONSTRAINT platillo_categoria
    FOREIGN KEY (idcategoria)
    REFERENCES categoria (idcategoria)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: promocion_platillo (table: oferta)
ALTER TABLE oferta ADD CONSTRAINT promocion_platillo
    FOREIGN KEY (idplato)
    REFERENCES platillo (idplato)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reserva_mesa (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_mesa
    FOREIGN KEY (idmesa)
    REFERENCES mesa (idmesa)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reserva_usuario (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_usuario
    FOREIGN KEY (idusuario)
    REFERENCES usuario (idusuario)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reseña_platillo (table: resenia)
ALTER TABLE resenia ADD CONSTRAINT resenia_platillo
    FOREIGN KEY (idplato)
    REFERENCES platillo (idplato)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reseña_usuario (table: resenia)
ALTER TABLE resenia ADD CONSTRAINT resenia_usuario
    FOREIGN KEY (idusuario)
    REFERENCES usuario (idusuario)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: usuarios_roles (table: usuario)
ALTER TABLE usuario ADD CONSTRAINT usuarios_roles
    FOREIGN KEY (idrol)
    REFERENCES rol (idrol)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

ALTER TABLE detalle_pedido ALTER COLUMN idreserva DROP NOT NULL;
;
ALTER TABLE pago ALTER COLUMN fecha TYPE DATE USING to_date(fecha::text, 'YYYYMMDD');

