package entities

import "testing"

func TestSuma(t *testing.T) {
	resultado := 2 + 3

	if resultado != 5 {
		t.Errorf("Se esperaba 5 pero se obtuvo %d", resultado)
	}
}