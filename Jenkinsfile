node {
    def app

    stage('Clone repository') {
        checkout scm
    }
    agent {
          docker { image 'node:10' }
    }
    stages {
         stage('Compile') {
                steps {
                    sh 'npm install && npm run build'
                }
         }
         stage('Test') {
                steps {
                    sh 'npm run test'
                }
         }
    }
    stage('Build image') {
        app = docker.build("alexpenedo/talkeat-be")
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("latest")
        }
    }
}