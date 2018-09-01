node {
    def app

    stage('Clone repository') {
        checkout scm
    }
    
    stage('Build image') {
        app = docker.build("alexpenedo/talkeat-be")
    }

    stage('Test image') {
        app.inside {
            sh 'npm run test'
        }
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("latest")
        }
    }
}