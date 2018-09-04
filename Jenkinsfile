node {
    stage('Clone repository') {
        checkout scm
    }

    stage('Compile/Test') {
       docker.image('mongo').withRun() { c ->
        docker.image('node:10').inside("--link ${c.id}:mongo") {
             withEnv([
                     'npm_config_cache=npm-cache',
                     'NODE_ENV=jenkins',
                     'HOME=.'
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