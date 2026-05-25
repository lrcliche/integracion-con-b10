-- Inicialización idempotente de la base de datos para la tienda online.
-- Compatible con montaje en /docker-entrypoint-initdb.d/init.sql

CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category    VARCHAR(100) NOT NULL,
    price       NUMERIC(12, 2) NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    image_url   TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, category, price, stock, image_url)
SELECT
    v.name,
    v.description,
    v.category,
    v.price,
    v.stock,
    v.image_url
FROM (
    VALUES
        (
            'Teclado mecánico para programador',
            'Teclado mecánico con switches táctiles, retroiluminación RGB y diseño compacto ideal para largas sesiones de código.',
            'Periféricos',
            149.99,
            25,
            'https://placehold.co/400x300?text=Teclado+mecanico'
        ),
        (
            'Mouse ergonómico',
            'Mouse vertical ergonómico con sensor de alta precisión y botones programables para reducir la fatiga en la muñeca.',
            'Periféricos',
            79.99,
            40,
            'https://placehold.co/400x300?text=Mouse+ergonomico'
        ),
        (
            'Monitor 27 pulgadas',
            'Monitor IPS de 27 pulgadas con resolución QHD, 75 Hz y marco delgado para un espacio de trabajo amplio.',
            'Periféricos',
            349.99,
            15,
            'https://placehold.co/400x300?text=Monitor+27'
        ),
        (
            'Laptop para desarrollo',
            'Laptop con procesador de alto rendimiento, 16 GB de RAM y SSD NVMe, optimizada para desarrollo de software.',
            'Computadores',
            1299.99,
            8,
            'https://placehold.co/400x300?text=Laptop+desarrollo'
        ),
        (
            'Disco SSD 1TB',
            'Unidad SSD NVMe de 1 TB con altas velocidades de lectura y escritura para acelerar compilaciones y despliegues.',
            'Almacenamiento',
            89.99,
            50,
            'https://placehold.co/400x300?text=SSD+1TB'
        ),
        (
            'Memoria RAM 32GB',
            'Kit de memoria DDR4 de 32 GB (2 x 16 GB) con baja latencia, ideal para entornos de desarrollo exigentes.',
            'Componentes',
            119.99,
            30,
            'https://placehold.co/400x300?text=RAM+32GB'
        ),
        (
            'Hub USB-C',
            'Hub multipuerto USB-C con HDMI, Ethernet, lector SD y carga rápida para conectar todos tus periféricos.',
            'Accesorios',
            49.99,
            60,
            'https://placehold.co/400x300?text=Hub+USB-C'
        ),
        (
            'Audífonos con micrófono',
            'Audífonos over-ear con cancelación pasiva de ruido y micrófono integrado para reuniones y pair programming.',
            'Periféricos',
            99.99,
            35,
            'https://placehold.co/400x300?text=Audifonos'
        ),
        (
            'Silla ergonómica',
            'Silla de oficina ergonómica con soporte lumbar ajustable, reposabrazos 3D y respaldo reclinable.',
            'Oficina',
            299.99,
            12,
            'https://placehold.co/400x300?text=Silla+ergonomica'
        ),
        (
            'Base refrigerante',
            'Base refrigerante con ventiladores silenciosos y ángulo ajustable para mantener la laptop fresca durante el trabajo.',
            'Accesorios',
            39.99,
            45,
            'https://placehold.co/400x300?text=Base+refrigerante'
        )
) AS v(name, description, category, price, stock, image_url)
WHERE NOT EXISTS (
    SELECT 1
    FROM products p
    WHERE p.name = v.name
);
