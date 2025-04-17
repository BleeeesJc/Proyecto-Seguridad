
INSERT INTO rol (rol) VALUES ('usuario');
INSERT INTO rol (rol) VALUES ('admin');
INSERT INTO rol (rol) VALUES ('cajero');

select * from usuario
insert into usuario (idusuario, nombre, apellidos, correo, password, idrol) values 
(1, 'Test', 'Usuario', 'test@example.com','Yummy123',2),
(6814265, 'jhuly', 'tarqui', 'jhulsdev@gmail.com','Yummy123.',2),
(2, 'Test2', 'UsuarioAppe', 'test3@example.com','Yummy123',3),
(3, 'Test3', 'UsuarioApellido', 'test4@example.com','Yummy123',1);

insert into mesa (capacidad) values 
(3),
(6),
(4),
(4),
(4),
(4),
(3),
(6),
(4),
(4),
(4),
(4),
(4),
(4),
(4);
-- Inserta reservas de ejemplo
INSERT INTO reserva (fecha, hora, estado, idusuario, idmesa)
VALUES 
('2024-11-20', '14:00:00', 1, 1, 10), -- Pendiente
('2024-11-20', '16:00:00', 0, 2, 11), -- Entregada
('2024-11-21', '12:00:00', 1, 3, 12), -- Pendiente
('2024-11-22', '18:00:00', 0, 6814265, 13), -- Entregada
('2024-11-23', '13:00:00', 1, 1, 14), -- Pendiente
('2024-11-24', '19:00:00', 0, 2, 15), -- Entregada
('2024-11-25', '11:00:00', 1, 3, 16), -- Pendiente
('2024-11-25', '15:00:00', 0, 6814265, 17), -- Entregada
('2024-11-26', '17:00:00', 1, 1, 8), -- Pendiente
('2024-11-27', '20:00:00', 0, 2, 9); -- Entregada

INSERT INTO categoria (idcategoria, tipo, descripcion) VALUES (1, 'Entradas', 'Deliciosos aperitivos para abrir el apetito y preparar el paladar para los sabores principales de nuestra cocina.');
INSERT INTO categoria (idcategoria, tipo, descripcion) VALUES (2, 'Platos fuertes', 'Platos completos que celebran lo mejor de nuestra cocina, llenos de tradición y sabor para una experiencia única.');
INSERT INTO categoria (idcategoria, tipo, descripcion) VALUES (3, 'Pescados y Mariscos', 'Para los amantes del mar, una selección de platos frescos y llenos de sabor.');
INSERT INTO categoria (idcategoria, tipo, descripcion) VALUES (4, 'Postres', 'Termina tu comida con un dulce toque, una variedad de postres tradicionales y opciones frescas para todos los gustos.');
INSERT INTO categoria (idcategoria, tipo, descripcion) VALUES (5, 'Bebidas', 'Refrescos y bebidas tradicionales que complementan perfectamente cada plato.');
INSERT INTO categoria (idcategoria, tipo, descripcion) VALUES (6, 'Especiales', 'Una selección exclusiva de platos únicos, creados con ingredientes frescos y recetas innovadoras que solo podrás disfrutar aquí.');

INSERT INTO platillo (nombre, descripcion, precio, idcategoria, imagen, estado) VALUES
('Trucha a la Plancha', 'Filete de trucha fresca cocida a la plancha con hierbas aromáticas, servida con papas doradas y una ensalada de verduras.', 55, 3, 'https://i.pinimg.com/736x/72/5b/cb/725bcbf4dc2d6c3e989e48ec05bab086.jpg', 1),
('Empanadas de Queso', 'Masa suave y dorada rellena de queso artesanal que se derrite en cada bocado, acompañada de una salsa ligeramente picante que potencia su sabor.', 8, 1, 'https://i.pinimg.com/736x/9f/f3/e4/9ff3e4c5021492db61e551c2ef051e91.jpg', 1),
('Sopa de Maní', 'Una sopa cremosa y nutritiva, preparada con maní molido, papas, verduras frescas y un toque de carne, servida caliente con perejil y un toque de orégano.', 12, 1, 'https://i.pinimg.com/736x/f8/51/99/f8519969af8e4c1e1d7a64c2cb741099.jpg', 1),
('Salteñas de Pollo', 'Tradicionales salteñas bolivianas rellenas de un guiso de pollo jugoso con papa, huevo, y un toque de picante, ideales para cualquier momento del día.', 10, 1, 'https://i.pinimg.com/736x/dd/69/95/dd69951d70f951704c8056e54375fd8b.jpg', 1),
('Anticuchos de Corazón', 'Brochetas de corazón de res marinadas con especias tradicionales, cocinadas a la parrilla y servidas con papas y una salsa picante de maní.', 20, 1, 'https://i.pinimg.com/736x/7c/04/dc/7c04dcf0d6a0127d3ecc81bfc47ac9b8.jpg', 1),
('Pique Macho', 'Un plato generoso y lleno de sabor, con trozos de carne de res, salchichas, papas fritas, tomates y cebollas, coronado con huevo cocido y una salsa picante.', 40, 2, 'https://i.pinimg.com/736x/ab/c1/12/abc1128eeb6a3eb2e477aed051ebf98e.jpg', 1),
('Majadito', 'Arroz cocido a fuego lento con charque de res, mezclado con especias y acompañado de yuca frita y plátano maduro.', 35, 2, 'https://i.pinimg.com/736x/0f/10/db/0f10db7e58ba98126a55ebe8e369e28b.jpg', 1),
('Churrasco', 'Jugosa carne de res a la parrilla, servida con arroz, papas a la huancaína y una fresca ensalada.', 50, 2, 'https://i.pinimg.com/736x/f9/b6/b6/f9b6b670fac72838259181b8f4073a02.jpg', 1),
('Pollo a la Brasa', 'Medio pollo sazonado con una mezcla especial de hierbas, asado a la perfección y acompañado de papas fritas doradas y ensalada fresca.', 35, 2, 'https://i.pinimg.com/736x/18/eb/3a/18eb3a4655299b55b01ae03031297a07.jpg', 1),
('Ceviche Mixto', 'Ceviche refrescante de pescado blanco y mariscos, marinado en jugo de limón, cebolla, maíz y cilantro.', 45, 3, 'https://i.pinimg.com/736x/bd/da/76/bdda767d5eae9d5f9ad1c29e42e12d7f.jpg', 1),
('Camarones al Ajillo', 'Camarones frescos salteados en aceite de oliva con ajo y perejil, servidos con rebanadas de pan tostado.', 50, 3, 'https://i.pinimg.com/736x/ad/8d/6e/ad8d6ea31d80d1e2ea9180a183e1b37a.jpg', 1),
('Sudado de Pescado', 'Pescado cocido en su propio jugo, con tomate, pimiento y cebolla, acompañado de yuca y plátano.', 38, 3, 'https://i.pinimg.com/736x/9b/19/e8/9b19e86f938dcac4b4fdd1f9f3911ca5.jpg', 1),
('Tostadas de Mariscos', 'Tostadas de maíz cubiertas con una mezcla de mariscos frescos y salsa de tomate.', 30, 3, 'https://i.pinimg.com/736x/27/be/ef/27beef4eb8179e0833149431bcf968a3.jpg', 1),
('Helado Artesanal', 'Helado cremoso y fresco, disponible en sabores exóticos de frutas tropicales.', 15, 4, 'https://i.pinimg.com/736x/18/4e/be/184ebe46387d186c3d82d3e9b268734a.jpg', 1),
('Mousse de Maracuyá', 'Mousse suave y aireada de maracuyá, con una mezcla ideal de dulce y ácido.', 20, 4, 'https://i.pinimg.com/236x/70/06/18/700618019f19f3e51131c9c646364022.jpg', 1),
('Suspiro Limeño', 'Postre tradicional a base de leche condensada y merengue con un toque de canela.', 18, 4, 'https://i.pinimg.com/736x/de/0f/8f/de0f8f63455de8a5d93fc148d8fa76ec.jpg', 1),
('Torta de Tres Leches', 'Bizcocho suave y empapado en una mezcla de leche evaporada, leche condensada y crema, decorado con frutas frescas.', 22, 4, 'https://i.pinimg.com/236x/54/cf/a0/54cfa04107ec5cf45c7978e0539de2de.jpg', 1),
('Flan de Caramelo', 'Postre de flan casero con caramelo, suave y ligero.', 16, 4, 'https://i.pinimg.com/236x/10/ec/a1/10eca1eef1b2545f4476ec4b08875c5c.jpg', 1),
('Mocochinchi', 'Refresco tradicional de durazno seco hervido con canela, servido frío.', 8, 5, 'https://i.pinimg.com/236x/1a/f6/98/1af6989ae4b646fbd41b54d58d6ae9a8.jpg', 1),
('Chicha Morada', 'Bebida andina hecha con maíz morado, piña y un toque de canela.', 10, 5, 'https://i.pinimg.com/236x/83/93/2b/83932bb0e433c4610461c57a9cd436b5.jpg', 1),
('Api con Pastel', 'Bebida caliente de maíz morado con clavo y canela, acompañado de un pastel de queso.', 12, 5, 'https://i.pinimg.com/236x/01/ae/24/01ae240bff47860ca389e9f1bdac0b09.jpg', 1),
('Jugo de Tumbo', 'Jugo fresco de tumbo, una fruta tropical y cítrica.', 9, 5, 'https://i.pinimg.com/736x/1d/59/38/1d59386e609be45970449951e9528c68.jpg', 1),
('Café Boliviano', 'Café de altura, producido en Bolivia, aromático y de sabor intenso.', 10, 5, 'https://i.pinimg.com/236x/23/39/b0/2339b0e4bc1c48d152945529d0b168fa.jpg', 1),
('Lomo Saltado Fusión', 'Lomo saltado reinventado con carne de res marinada en salsa de soya y ají, acompañado de papas fritas y arroz.', 55, 6, 'https://i.pinimg.com/236x/f8/31/23/f8312355cd3a5dd93ef2c160305d5936.jpg', 1),
('Rollo de Quinoa y Pollo', 'Rollos de quinoa con pollo, espinaca y queso fresco, servidos con una salsa de hierbas.', 48, 6, 'https://i.pinimg.com/736x/47/38/fc/4738fc6f229031526d7a66c4a243da9f.jpg', 1);

