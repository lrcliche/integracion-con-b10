package entities

import (
	"errors"
	"strings"
	"time"
)

var (
	ErrInvalidProductName  = errors.New("product name is required")
	ErrInvalidProductPrice = errors.New("product price must be greater than zero")
)

type Product struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Price       float64   `json:"price"`
	Stock       int       `json:"stock"`
	ImageURL    string    `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
}

func (p *Product) Validate() error {
	if strings.TrimSpace(p.Name) == "" {
		return ErrInvalidProductName
	}

	if p.Price <= 0 {
		return ErrInvalidProductPrice
	}

	return nil
}
