PGDMP                       }            yummyDB    17.4    17.4 e    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    17197    yummyDB    DATABASE     o   CREATE DATABASE "yummyDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'es-ES';
    DROP DATABASE "yummyDB";
                     postgres    false            �            1259    17347    actividades    TABLE     �   CREATE TABLE public.actividades (
    idactividad integer NOT NULL,
    usuario character varying(255) NOT NULL,
    fecha timestamp with time zone,
    estado character varying(50)
);
    DROP TABLE public.actividades;
       public         heap r       postgres    false            �            1259    17346    actividades_idactividad_seq    SEQUENCE     �   CREATE SEQUENCE public.actividades_idactividad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.actividades_idactividad_seq;
       public               postgres    false    240            �           0    0    actividades_idactividad_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.actividades_idactividad_seq OWNED BY public.actividades.idactividad;
          public               postgres    false    239            �            1259    17199 	   categoria    TABLE     �   CREATE TABLE public.categoria (
    idcategoria integer NOT NULL,
    tipo character varying(30),
    descripcion character varying(150)
);
    DROP TABLE public.categoria;
       public         heap r       postgres    false            �            1259    17198    categoria_idcategoria_seq    SEQUENCE     �   CREATE SEQUENCE public.categoria_idcategoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.categoria_idcategoria_seq;
       public               postgres    false    218            �           0    0    categoria_idcategoria_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.categoria_idcategoria_seq OWNED BY public.categoria.idcategoria;
          public               postgres    false    217            �            1259    17206    detalle_pedido    TABLE     �   CREATE TABLE public.detalle_pedido (
    iddetalle integer NOT NULL,
    cantidad integer,
    idplato integer,
    idpedido integer,
    idreserva integer
);
 "   DROP TABLE public.detalle_pedido;
       public         heap r       postgres    false            �            1259    17205    detalle_pedido_iddetalle_seq    SEQUENCE     �   CREATE SEQUENCE public.detalle_pedido_iddetalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.detalle_pedido_iddetalle_seq;
       public               postgres    false    220            �           0    0    detalle_pedido_iddetalle_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.detalle_pedido_iddetalle_seq OWNED BY public.detalle_pedido.iddetalle;
          public               postgres    false    219            �            1259    17213    mesa    TABLE     �   CREATE TABLE public.mesa (
    idmesa integer NOT NULL,
    capacidad integer,
    nombre character varying(255),
    posx real,
    posy real,
    visible boolean
);
    DROP TABLE public.mesa;
       public         heap r       postgres    false            �            1259    17212    mesa_idmesa_seq    SEQUENCE     �   CREATE SEQUENCE public.mesa_idmesa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.mesa_idmesa_seq;
       public               postgres    false    222            �           0    0    mesa_idmesa_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.mesa_idmesa_seq OWNED BY public.mesa.idmesa;
          public               postgres    false    221            �            1259    17220    oferta    TABLE     (  CREATE TABLE public.oferta (
    idoferta integer NOT NULL,
    src character varying(120),
    titulo character varying(70),
    requerimiento character varying(100),
    descripcion character varying(70),
    fecha_inicio date,
    fecha_fin date,
    descuento integer,
    idplato integer
);
    DROP TABLE public.oferta;
       public         heap r       postgres    false            �            1259    17219    oferta_idoferta_seq    SEQUENCE     �   CREATE SEQUENCE public.oferta_idoferta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.oferta_idoferta_seq;
       public               postgres    false    224            �           0    0    oferta_idoferta_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.oferta_idoferta_seq OWNED BY public.oferta.idoferta;
          public               postgres    false    223            �            1259    17227    pago    TABLE     �   CREATE TABLE public.pago (
    idpago integer NOT NULL,
    fecha date,
    monto real,
    idpedido integer,
    idusuario integer
);
    DROP TABLE public.pago;
       public         heap r       postgres    false            �            1259    17226    pago_idpago_seq    SEQUENCE     �   CREATE SEQUENCE public.pago_idpago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.pago_idpago_seq;
       public               postgres    false    226            �           0    0    pago_idpago_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.pago_idpago_seq OWNED BY public.pago.idpago;
          public               postgres    false    225            �            1259    17234    pedido    TABLE     �   CREATE TABLE public.pedido (
    idpedido integer NOT NULL,
    fecha date,
    hora time without time zone,
    estado integer,
    idusuario integer,
    precio_total real
);
    DROP TABLE public.pedido;
       public         heap r       postgres    false            �            1259    17233    pedido_idpedido_seq    SEQUENCE     �   CREATE SEQUENCE public.pedido_idpedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.pedido_idpedido_seq;
       public               postgres    false    228            �           0    0    pedido_idpedido_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.pedido_idpedido_seq OWNED BY public.pedido.idpedido;
          public               postgres    false    227            �            1259    17241    platillo    TABLE     �   CREATE TABLE public.platillo (
    idplato integer NOT NULL,
    nombre character varying(100),
    descripcion character varying(200),
    precio real,
    idcategoria integer,
    imagen character varying(100),
    estado integer
);
    DROP TABLE public.platillo;
       public         heap r       postgres    false            �            1259    17240    platillo_idplato_seq    SEQUENCE     �   CREATE SEQUENCE public.platillo_idplato_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.platillo_idplato_seq;
       public               postgres    false    230            �           0    0    platillo_idplato_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.platillo_idplato_seq OWNED BY public.platillo.idplato;
          public               postgres    false    229            �            1259    17248    resenia    TABLE     �   CREATE TABLE public.resenia (
    idresenia integer NOT NULL,
    puntuacion integer NOT NULL,
    fecha date NOT NULL,
    idusuario integer,
    idplato integer
);
    DROP TABLE public.resenia;
       public         heap r       postgres    false            �            1259    17247    resenia_idresenia_seq    SEQUENCE     �   CREATE SEQUENCE public.resenia_idresenia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.resenia_idresenia_seq;
       public               postgres    false    232            �           0    0    resenia_idresenia_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.resenia_idresenia_seq OWNED BY public.resenia.idresenia;
          public               postgres    false    231            �            1259    17255    reserva    TABLE     �   CREATE TABLE public.reserva (
    idreserva integer NOT NULL,
    fecha date,
    hora time without time zone,
    estado integer,
    idusuario integer,
    idmesa integer
);
    DROP TABLE public.reserva;
       public         heap r       postgres    false            �            1259    17254    reserva_idreserva_seq    SEQUENCE     �   CREATE SEQUENCE public.reserva_idreserva_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.reserva_idreserva_seq;
       public               postgres    false    234            �           0    0    reserva_idreserva_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.reserva_idreserva_seq OWNED BY public.reserva.idreserva;
          public               postgres    false    233            �            1259    17262    rol    TABLE     �  CREATE TABLE public.rol (
    idrol integer NOT NULL,
    rol character varying(25) NOT NULL,
    pagos boolean NOT NULL,
    reservas boolean NOT NULL,
    menu boolean NOT NULL,
    ofertas boolean NOT NULL,
    usuarios boolean NOT NULL,
    platillos boolean NOT NULL,
    mesas boolean NOT NULL,
    paneladmin boolean NOT NULL,
    roles boolean NOT NULL,
    reportes boolean NOT NULL
);
    DROP TABLE public.rol;
       public         heap r       postgres    false            �            1259    17261    rol_idrol_seq    SEQUENCE     �   CREATE SEQUENCE public.rol_idrol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.rol_idrol_seq;
       public               postgres    false    236            �           0    0    rol_idrol_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.rol_idrol_seq OWNED BY public.rol.idrol;
          public               postgres    false    235            �            1259    17269    usuario    TABLE     %  CREATE TABLE public.usuario (
    idusuario integer NOT NULL,
    nombre character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    idrol integer NOT NULL,
    activo boolean
);
    DROP TABLE public.usuario;
       public         heap r       postgres    false            �            1259    17268    usuario_idusuario_seq    SEQUENCE     �   CREATE SEQUENCE public.usuario_idusuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.usuario_idusuario_seq;
       public               postgres    false    238            �           0    0    usuario_idusuario_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.usuario_idusuario_seq OWNED BY public.usuario.idusuario;
          public               postgres    false    237            �           2604    17350    actividades idactividad    DEFAULT     �   ALTER TABLE ONLY public.actividades ALTER COLUMN idactividad SET DEFAULT nextval('public.actividades_idactividad_seq'::regclass);
 F   ALTER TABLE public.actividades ALTER COLUMN idactividad DROP DEFAULT;
       public               postgres    false    240    239    240            �           2604    17202    categoria idcategoria    DEFAULT     ~   ALTER TABLE ONLY public.categoria ALTER COLUMN idcategoria SET DEFAULT nextval('public.categoria_idcategoria_seq'::regclass);
 D   ALTER TABLE public.categoria ALTER COLUMN idcategoria DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    17209    detalle_pedido iddetalle    DEFAULT     �   ALTER TABLE ONLY public.detalle_pedido ALTER COLUMN iddetalle SET DEFAULT nextval('public.detalle_pedido_iddetalle_seq'::regclass);
 G   ALTER TABLE public.detalle_pedido ALTER COLUMN iddetalle DROP DEFAULT;
       public               postgres    false    219    220    220            �           2604    17216    mesa idmesa    DEFAULT     j   ALTER TABLE ONLY public.mesa ALTER COLUMN idmesa SET DEFAULT nextval('public.mesa_idmesa_seq'::regclass);
 :   ALTER TABLE public.mesa ALTER COLUMN idmesa DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    17223    oferta idoferta    DEFAULT     r   ALTER TABLE ONLY public.oferta ALTER COLUMN idoferta SET DEFAULT nextval('public.oferta_idoferta_seq'::regclass);
 >   ALTER TABLE public.oferta ALTER COLUMN idoferta DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    17230    pago idpago    DEFAULT     j   ALTER TABLE ONLY public.pago ALTER COLUMN idpago SET DEFAULT nextval('public.pago_idpago_seq'::regclass);
 :   ALTER TABLE public.pago ALTER COLUMN idpago DROP DEFAULT;
       public               postgres    false    226    225    226            �           2604    17237    pedido idpedido    DEFAULT     r   ALTER TABLE ONLY public.pedido ALTER COLUMN idpedido SET DEFAULT nextval('public.pedido_idpedido_seq'::regclass);
 >   ALTER TABLE public.pedido ALTER COLUMN idpedido DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    17244    platillo idplato    DEFAULT     t   ALTER TABLE ONLY public.platillo ALTER COLUMN idplato SET DEFAULT nextval('public.platillo_idplato_seq'::regclass);
 ?   ALTER TABLE public.platillo ALTER COLUMN idplato DROP DEFAULT;
       public               postgres    false    230    229    230            �           2604    17251    resenia idresenia    DEFAULT     v   ALTER TABLE ONLY public.resenia ALTER COLUMN idresenia SET DEFAULT nextval('public.resenia_idresenia_seq'::regclass);
 @   ALTER TABLE public.resenia ALTER COLUMN idresenia DROP DEFAULT;
       public               postgres    false    232    231    232            �           2604    17258    reserva idreserva    DEFAULT     v   ALTER TABLE ONLY public.reserva ALTER COLUMN idreserva SET DEFAULT nextval('public.reserva_idreserva_seq'::regclass);
 @   ALTER TABLE public.reserva ALTER COLUMN idreserva DROP DEFAULT;
       public               postgres    false    233    234    234            �           2604    17265 	   rol idrol    DEFAULT     f   ALTER TABLE ONLY public.rol ALTER COLUMN idrol SET DEFAULT nextval('public.rol_idrol_seq'::regclass);
 8   ALTER TABLE public.rol ALTER COLUMN idrol DROP DEFAULT;
       public               postgres    false    235    236    236            �           2604    17272    usuario idusuario    DEFAULT     v   ALTER TABLE ONLY public.usuario ALTER COLUMN idusuario SET DEFAULT nextval('public.usuario_idusuario_seq'::regclass);
 @   ALTER TABLE public.usuario ALTER COLUMN idusuario DROP DEFAULT;
       public               postgres    false    238    237    238            �          0    17347    actividades 
   TABLE DATA           J   COPY public.actividades (idactividad, usuario, fecha, estado) FROM stdin;
    public               postgres    false    240   �w       �          0    17199 	   categoria 
   TABLE DATA           C   COPY public.categoria (idcategoria, tipo, descripcion) FROM stdin;
    public               postgres    false    218   �x       �          0    17206    detalle_pedido 
   TABLE DATA           [   COPY public.detalle_pedido (iddetalle, cantidad, idplato, idpedido, idreserva) FROM stdin;
    public               postgres    false    220   =z       �          0    17213    mesa 
   TABLE DATA           N   COPY public.mesa (idmesa, capacidad, nombre, posx, posy, visible) FROM stdin;
    public               postgres    false    222   Zz       �          0    17220    oferta 
   TABLE DATA           �   COPY public.oferta (idoferta, src, titulo, requerimiento, descripcion, fecha_inicio, fecha_fin, descuento, idplato) FROM stdin;
    public               postgres    false    224   wz       �          0    17227    pago 
   TABLE DATA           I   COPY public.pago (idpago, fecha, monto, idpedido, idusuario) FROM stdin;
    public               postgres    false    226   �z       �          0    17234    pedido 
   TABLE DATA           X   COPY public.pedido (idpedido, fecha, hora, estado, idusuario, precio_total) FROM stdin;
    public               postgres    false    228   �z       �          0    17241    platillo 
   TABLE DATA           e   COPY public.platillo (idplato, nombre, descripcion, precio, idcategoria, imagen, estado) FROM stdin;
    public               postgres    false    230   �z       �          0    17248    resenia 
   TABLE DATA           S   COPY public.resenia (idresenia, puntuacion, fecha, idusuario, idplato) FROM stdin;
    public               postgres    false    232   �       �          0    17255    reserva 
   TABLE DATA           T   COPY public.reserva (idreserva, fecha, hora, estado, idusuario, idmesa) FROM stdin;
    public               postgres    false    234   �       �          0    17262    rol 
   TABLE DATA           �   COPY public.rol (idrol, rol, pagos, reservas, menu, ofertas, usuarios, platillos, mesas, paneladmin, roles, reportes) FROM stdin;
    public               postgres    false    236   )�       �          0    17269    usuario 
   TABLE DATA           `   COPY public.usuario (idusuario, nombre, apellidos, correo, password, idrol, activo) FROM stdin;
    public               postgres    false    238   g�       �           0    0    actividades_idactividad_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.actividades_idactividad_seq', 9, true);
          public               postgres    false    239            �           0    0    categoria_idcategoria_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.categoria_idcategoria_seq', 1, false);
          public               postgres    false    217            �           0    0    detalle_pedido_iddetalle_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.detalle_pedido_iddetalle_seq', 1, false);
          public               postgres    false    219            �           0    0    mesa_idmesa_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.mesa_idmesa_seq', 1, false);
          public               postgres    false    221            �           0    0    oferta_idoferta_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.oferta_idoferta_seq', 1, false);
          public               postgres    false    223            �           0    0    pago_idpago_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.pago_idpago_seq', 1, false);
          public               postgres    false    225            �           0    0    pedido_idpedido_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.pedido_idpedido_seq', 1, false);
          public               postgres    false    227            �           0    0    platillo_idplato_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.platillo_idplato_seq', 25, true);
          public               postgres    false    229            �           0    0    resenia_idresenia_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.resenia_idresenia_seq', 1, false);
          public               postgres    false    231            �           0    0    reserva_idreserva_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.reserva_idreserva_seq', 1, false);
          public               postgres    false    233            �           0    0    rol_idrol_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.rol_idrol_seq', 4, true);
          public               postgres    false    235            �           0    0    usuario_idusuario_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.usuario_idusuario_seq', 2, true);
          public               postgres    false    237            �           2606    17352    actividades actividades_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.actividades
    ADD CONSTRAINT actividades_pkey PRIMARY KEY (idactividad);
 F   ALTER TABLE ONLY public.actividades DROP CONSTRAINT actividades_pkey;
       public                 postgres    false    240            �           2606    17204    categoria categoria_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (idcategoria);
 B   ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
       public                 postgres    false    218            �           2606    17211 "   detalle_pedido detalle_pedido_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pkey PRIMARY KEY (iddetalle);
 L   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT detalle_pedido_pkey;
       public                 postgres    false    220            �           2606    17218    mesa mesa_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (idmesa);
 8   ALTER TABLE ONLY public.mesa DROP CONSTRAINT mesa_pkey;
       public                 postgres    false    222            �           2606    17225    oferta oferta_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.oferta
    ADD CONSTRAINT oferta_pkey PRIMARY KEY (idoferta);
 <   ALTER TABLE ONLY public.oferta DROP CONSTRAINT oferta_pkey;
       public                 postgres    false    224            �           2606    17232    pago pago_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (idpago);
 8   ALTER TABLE ONLY public.pago DROP CONSTRAINT pago_pkey;
       public                 postgres    false    226            �           2606    17239    pedido pedido_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (idpedido);
 <   ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_pkey;
       public                 postgres    false    228            �           2606    17246    platillo platillo_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.platillo
    ADD CONSTRAINT platillo_pkey PRIMARY KEY (idplato);
 @   ALTER TABLE ONLY public.platillo DROP CONSTRAINT platillo_pkey;
       public                 postgres    false    230            �           2606    17253    resenia resenia_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT resenia_pkey PRIMARY KEY (idresenia);
 >   ALTER TABLE ONLY public.resenia DROP CONSTRAINT resenia_pkey;
       public                 postgres    false    232            �           2606    17260    reserva reserva_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_pkey PRIMARY KEY (idreserva);
 >   ALTER TABLE ONLY public.reserva DROP CONSTRAINT reserva_pkey;
       public                 postgres    false    234            �           2606    17267    rol rol_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (idrol);
 6   ALTER TABLE ONLY public.rol DROP CONSTRAINT rol_pkey;
       public                 postgres    false    236            �           2606    17276    usuario usuario_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (idusuario);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public                 postgres    false    238            �           2606    17277 $   detalle_pedido detalle_pedido_pedido    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pedido FOREIGN KEY (idpedido) REFERENCES public.pedido(idpedido);
 N   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT detalle_pedido_pedido;
       public               postgres    false    228    4820    220            �           2606    17282 &   detalle_pedido detalle_pedido_platillo    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_platillo FOREIGN KEY (idplato) REFERENCES public.platillo(idplato);
 P   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT detalle_pedido_platillo;
       public               postgres    false    230    220    4822            �           2606    17287 %   detalle_pedido detalle_pedido_reserva    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_reserva FOREIGN KEY (idreserva) REFERENCES public.reserva(idreserva);
 O   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT detalle_pedido_reserva;
       public               postgres    false    4826    220    234            �           2606    17292    pago pago_pedido    FK CONSTRAINT     w   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pedido FOREIGN KEY (idpedido) REFERENCES public.pedido(idpedido);
 :   ALTER TABLE ONLY public.pago DROP CONSTRAINT pago_pedido;
       public               postgres    false    228    226    4820            �           2606    17297    pago pago_usuario    FK CONSTRAINT     {   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario);
 ;   ALTER TABLE ONLY public.pago DROP CONSTRAINT pago_usuario;
       public               postgres    false    238    226    4830            �           2606    17302    pedido pedido_usuario    FK CONSTRAINT        ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario);
 ?   ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_usuario;
       public               postgres    false    228    4830    238            �           2606    17307    platillo platillo_categoria    FK CONSTRAINT     �   ALTER TABLE ONLY public.platillo
    ADD CONSTRAINT platillo_categoria FOREIGN KEY (idcategoria) REFERENCES public.categoria(idcategoria);
 E   ALTER TABLE ONLY public.platillo DROP CONSTRAINT platillo_categoria;
       public               postgres    false    230    218    4810            �           2606    17312    oferta promocion_platillo    FK CONSTRAINT     �   ALTER TABLE ONLY public.oferta
    ADD CONSTRAINT promocion_platillo FOREIGN KEY (idplato) REFERENCES public.platillo(idplato);
 C   ALTER TABLE ONLY public.oferta DROP CONSTRAINT promocion_platillo;
       public               postgres    false    4822    224    230            �           2606    17327    resenia resenia_platillo    FK CONSTRAINT        ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT resenia_platillo FOREIGN KEY (idplato) REFERENCES public.platillo(idplato);
 B   ALTER TABLE ONLY public.resenia DROP CONSTRAINT resenia_platillo;
       public               postgres    false    230    4822    232            �           2606    17332    resenia resenia_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT resenia_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario);
 A   ALTER TABLE ONLY public.resenia DROP CONSTRAINT resenia_usuario;
       public               postgres    false    232    238    4830            �           2606    17317    reserva reserva_mesa    FK CONSTRAINT     u   ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_mesa FOREIGN KEY (idmesa) REFERENCES public.mesa(idmesa);
 >   ALTER TABLE ONLY public.reserva DROP CONSTRAINT reserva_mesa;
       public               postgres    false    4814    234    222            �           2606    17322    reserva reserva_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario);
 A   ALTER TABLE ONLY public.reserva DROP CONSTRAINT reserva_usuario;
       public               postgres    false    234    4830    238            �           2606    17337    usuario usuarios_roles    FK CONSTRAINT     t   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuarios_roles FOREIGN KEY (idrol) REFERENCES public.rol(idrol);
 @   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuarios_roles;
       public               postgres    false    236    4828    238            �   �   x���=!�k8��	�o�Al�������l<�b��Y�I���{�=cI��#���5U��%��0�'A���e���ω]b)y��
�m����+W#d�;�h��!Z2�WЬa_	l�?V@'{��g-8�3�y\������l
�Ayݳ~$[逬�'������      �   �  x�e�Mn1��3������h����u�����P���*�l}�>il�?;I����w�},F���Y���&E�X&2r4����
E���Kƭ�OL��n@S�Y��l�����.V�s^�D����>P��Ce+��[�k
�VO�����Q�d��O��G�\��47�q~��� W����c0�;�E��0�9{Z�}r_�${��
�K�n%��9H~Ӏb���cߧ�`��4~�
\8�ƶؕ�\��D�tK�
Ǜ�(�����7�=ѓ��6|Ѧ�kmf�c� �ƻ�3����o��v���y��cA����Pۢ���O��>'F�����?�P�鏄z�w����w��ƋpO�g� Nb�#.mhY��.v���%�|=z��i�1����0
�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   	  x��X�n�H<�_�h�,���ڛm�`1ޱ���zdI4���)��7>�A��|B��Dɖd{z	]�gFfTddW�?�G{��Ny���3MCvk'�O�}��1È��H}O����v<ф;{��O�3�؝(�C��7�c���x��|w�x�d{����h�{:�c�-�É��p�ƛLg"�?���?���9v�nw��m��^�Xĺ �E�IzUVB�*�F�R�WK%Ȉ��ǻL�����1sk��?�#�D����tv�G:ڔ?�=ߑclG{��.�1�#RG�<>3?�o�v<�9:~�����w��>w�7w���;{n2Q]�u�DaJ�52 H��6�W޵R�Ƭ�e���'B5R�?}?d����݀b���Y/p@�С��V�i�`~7w�@�Z����n������3= =�A�5��]��&Nk�g��6w4"��~l�����*���Fa�� ���hK�u�R�nUڭ�U��p�����=�����!{7��N<��5ʉ��ݲAMG7���2i;���U �ehc��L����%==�]�1oKܺɪ�[_���R���RTm��{-\����8��n�W��7��{�,�сF��cΥM�L�m�=�×%K��k2v����=�~�Q��i�[H��	��m�ʈ���)Qa�Q
n2Yf���^���Qi"�ؚ\E�m-��.M+�J�U:��x�w�<�t7�}��<��҄rO_|��})��-K�z��]��ܱ?=aϢ�l�Z]ES�B�EpX�2���v�hQ5V)r��nU�����<Be����ξ*�k޽P ��~�W��~�o�O�VbQ.�7J�d�z-�)\�Ѹ�5�yַ��u�� u�e[۲Z�7YҚ����f��aU��~y&
ǳT`�}� �!�Y����$�g�;ޯߕ�%?�>�E�0���o��.��ł\me�Te�Sʕ�RY���Lk�v�
�zO�#�s�� ��m���v?������J��2��������}��ݶ������npb�I��W��P[�([�mڠȒ	*�%ɊDڸ�{�P�ӫ�ߢQ�]<Kp��e ܉㵞� ��������6n�$����d:�a�����Pht �B��l-�.���,(XZ�k�n���>�a�Ƈ%����I��8�ñ[�ڪ�I۰��}�D��?҄g5 ��U�����tM���^:C�����P�٧��%a�+g^\��g�sZ;ϋM��Xn���q�b�[�"�����QAG%9-ZC��k�/Y�i����e�/J��v��ہ�wqV�pvy��p�\��d�K��~�|�Kq�O��?Є�T&�odI�Ј�dS�6��:�
�Ӹ��m-/�Q��0O��r����_�c�A��H���o��My�<|I�{�w��2�R�������ˢl8�,�Z��������7 �Ȳ�dV4��t��!����Ɓ� �H/�
�:�P��`�b`��Kw3�^��ʅ,�YĭMG,ʨcSK�i����R�>䷐[p4�W|�*��1Mٻ�6��pI4�YЗM���
z��$��b��L �wk�Y)��v��Z%[b�-�[��G�|kZM��M�*l���	Ҝ���I��T��˧�Z��Ń���.�Ӏ�3@s5,��3*�[��(\���Rr��+�n��2�0��;�?�u�J�+�$����L�X~�(�(���H��i�M]��)��"6FKҁ��)��AA�ь��Z�/�'��ߦ�f�ȱ����Έx��2����SQY�!�ߍ_+o˫�0uQ9,L]9W��k/Q�߫�dݸM�+��=v)�v:Q��x��.J�����ǚ�o���#?�2h��Zܥ(,�,؍T�t1�V7���6�p��ҕ����Z�O��-fr�$�|p��B쏋�r��'�����Ŵ(m(�)jT;(�����@p��l&yT#�*�K�k��x�#�������[��<�aޚ�z�7{t�.�m��;���rw��U]�0�%��c��P(�'��҉z��)�_������i��z.���H������Kߦɥ��w������;F�2�����5RYsW�E-]�0��R>�`(0�ʋ�Uqe���~M><��g�q �:�i��;v� �����־_��A���ë�C�$[�O�X�:�&V���VU�?l4^�J����W�>�3kB>�����O]O�F<-g�1'�����r�2�.�=��Ǎ���R��Y��]�	�f�%(U�{j�Ba�uX(�]�$_8�6���K�,�{��o޼y��Czt      �      x������ � �      �      x������ � �      �   .   x�3�LL����L��(	�\���ť�E��>X��"�+F��� {      �   �   x�e͹�@@����#�c��D��SYF����������K1����)B�ˬ]C6�d(Rr����Ꚛӓ���-yډ=�'{�,Ȓək����5�U�2�,�㛅�GL���V(,%���/Z�K���_���.��z�aoe��x�e7`�H�#^��u»ú��K�׎5�t ��| ��G2     