node {
    stage('Clone repository') {
        checkout scm
    }

    stage('Compile/Test') {
         docker.image('node:10').inside {
             sh 'npm install && npm run build'
             sh 'npm run test'
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