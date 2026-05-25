package container

import (
	"database/sql"
	"time"

	_ "github.com/lib/pq"
	"template-go-hexagonal/application/config"
	"template-go-hexagonal/application/services"
	"template-go-hexagonal/infrastructure/repositories"
	"template-go-hexagonal/presentation/handlers"
)

// Container in the free version keeps wiring explicit and simple.
type Container struct {
	productHandler *handlers.ProductHandler
	db             *sql.DB
}

func New(cfg config.Config) (*Container, error) {
	db, err := sql.Open("postgres", cfg.DatabaseDSN())
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	productRepository := repositories.NewPostgresProductRepository(db)
	productService := services.NewProductService(productRepository)
	productHandler := handlers.NewProductHandler(productService)

	return &Container{productHandler: productHandler, db: db}, nil
}

func (c *Container) Close() error {
	if c.db == nil {
		return nil
	}

	return c.db.Close()
}

func (c *Container) ProductHandler() *handlers.ProductHandler {
	return c.productHandler
}
