pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_PROJECT_NAME = 'integracion-con-b10-ci'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validar estructura del proyecto') {
            steps {
                sh '''
                    echo "Validando estructura base del proyecto..."

                    test -d backend
                    test -d frontend
                    test -d database
                    test -f docker-compose.yml

                    echo "Estructura validada correctamente."
                '''
            }
        }

        stage('Validar Docker Compose') {
            steps {
                sh '''
                    echo "Validando sintaxis de docker-compose.yml..."
                    docker-compose -f docker-compose.yml config
                '''
            }
        }

        stage('Listar servicios del proyecto') {
            steps {
                sh '''
                    echo "Servicios definidos en Docker Compose:"
                    docker-compose -f docker-compose.yml config --services
                '''
            }
        }

        stage('Construir contenedores') {
            steps {
                sh '''
                    echo "Construyendo imágenes del proyecto..."
                    docker-compose -f docker-compose.yml build
                '''
            }
        }

        stage('Validación final') {
            steps {
                sh '''
                    echo "Pipeline CI ejecutado correctamente."
                    echo "Jenkins validó estructura, Docker Compose y construcción de imágenes."
                '''
            }
        }
    }

    post {
        success {
            echo 'CI finalizado correctamente con Jenkins y Docker.'
        }

        failure {
            echo 'El pipeline falló. Revisar logs en Jenkins.'
        }

        always {
            echo 'Finalizó la ejecución del pipeline.'
        }
    }
}