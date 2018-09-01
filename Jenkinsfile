node {
    stage('Clone repository') {
        checkout scm
    }

    stage('Compile/Test') {
        docker.image('mongo:3.2').withRun('-e "MONGO_INITDB_ROOT_PASSWORD=my-secret-pw"') { c ->
             docker.image('node:10').inside("--link ${c.id}:db") {
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