node {
    stage('Clone repository') {
        checkout scm
    }

    stage('Compile/Test') {
        docker.image('mongo:3.2').run('--network host') {
             docker.image('node:10').withRun('-network host').inside() {
             withEnv([
                     'npm_config_cache=npm-cache',
                     'MONGO_HOST=mongodb://mongo',
                     'HOME=.',
                 ]) {
                     sh 'npm install && npm run build'
                     sh 'npm run test'
                 }
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