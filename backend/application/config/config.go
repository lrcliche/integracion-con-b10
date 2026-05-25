package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv              string
	HTTPPort            string
	ReadTimeoutSeconds  int
	WriteTimeoutSeconds int
	Database            DatabaseConfig
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

func MustLoad() Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	return Config{
		AppEnv:              getEnv("APP_ENV", "development"),
		HTTPPort:            getEnv("APP_PORT", getEnv("HTTP_PORT", "8080")),
		ReadTimeoutSeconds:  getEnvAsInt("READ_TIMEOUT_SECONDS", 10),
		WriteTimeoutSeconds: getEnvAsInt("WRITE_TIMEOUT_SECONDS", 10),
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "postgres"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Name:     getEnv("DB_NAME", "integration_store"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
	}
}

func (c Config) DatabaseDSN() string {
	return "host=" + c.Database.Host +
		" port=" + c.Database.Port +
		" user=" + c.Database.User +
		" password=" + c.Database.Password +
		" dbname=" + c.Database.Name +
		" sslmode=" + c.Database.SSLMode
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}
