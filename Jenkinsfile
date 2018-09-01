node {
    stage('Clone repository') {
        checkout scm
    }

    stage('Compile/Test') {
        docker.image('mongo:3.2') { c ->
             docker.image('node:10').withRun('-e "MONGO_HOST=mongodb://db"').inside("--link ${c.id}:db") {
             withEnv([
                     'npm_config_cache=npm-cache',
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