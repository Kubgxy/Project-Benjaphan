pipeline {
  agent any

  options {
    skipDefaultCheckout()
  }

  parameters {
    booleanParam(name: 'USE_NO_CACHE', defaultValue: false, description: 'ใช้ --no-cache หรือไม่')
  }

  environment {
    DOCKER_BUILDKIT = '1'
    COMPOSE_DOCKER_CLI_BUILD = '1'
  }

  stages {

    stage('🔄 Clean Workspace') {
      steps {
        deleteDir()
      }
    }

    stage('📥 Checkout Source Code') {
      steps {
        dir('/opt/jenkins_workspace/Benjaphan-Deploy') {
          checkout scm
        }
      }
    }

    stage('🔐 Load Secrets') {
      steps {
        withCredentials([
          string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI'),
          string(credentialsId: 'PORT', variable: 'PORT'),
          string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
          string(credentialsId: 'GOOGLE_CLIENT_ID', variable: 'GOOGLE_CLIENT_ID'),
          string(credentialsId: 'GOOGLE_CLIENT_SECRET', variable: 'GOOGLE_CLIENT_SECRET'),
          string(credentialsId: 'FACEBOOK_CLIENT_ID', variable: 'FACEBOOK_CLIENT_ID'),
          string(credentialsId: 'FACEBOOK_CLIENT_SECRET', variable: 'FACEBOOK_CLIENT_SECRET')
        ]) {
          echo '🔒 Secrets loaded into environment'
        }
      }
    }

    stage('♻️ Docker Down') {
      steps {
        dir('/opt/jenkins_workspace/Benjaphan-Deploy') {
          sh 'docker-compose down --remove-orphans || true'
        }
      }
    }

    stage('🐳 Docker Build') {
      steps {
        dir('/opt/jenkins_workspace/Benjaphan-Deploy') {
          script {
            def markerFile = '/opt/jenkins_marker/.built_once'
            def useNoCache = !fileExists(markerFile) || params.USE_NO_CACHE
            def composeCmd = useNoCache ? 'docker-compose build --no-cache' : 'docker-compose build'

            echo "🧠 Using no-cache: ${useNoCache}"

            if (useNoCache) {
              writeFile file: markerFile, text: "✅ Built at: ${new Date()}"
            }

            withEnv([
              "MONGODB_URI=${env.MONGODB_URI}",
              "PORT=${env.PORT}",
              "JWT_SECRET=${env.JWT_SECRET}",
              "GOOGLE_CLIENT_ID=${env.GOOGLE_CLIENT_ID}",
              "GOOGLE_CLIENT_SECRET=${env.GOOGLE_CLIENT_SECRET}",
              "FACEBOOK_CLIENT_ID=${env.FACEBOOK_CLIENT_ID}",
              "FACEBOOK_CLIENT_SECRET=${env.FACEBOOK_CLIENT_SECRET}",
              "NODE_ENV=production"
            ]) {
              sh composeCmd
            }
          }
        }
      }
    }

    stage('🚀 Docker Up') {
      steps {
        dir('/opt/jenkins_workspace/Benjaphan-Deploy') {
          withEnv([
            "MONGODB_URI=${env.MONGODB_URI}",
            "PORT=${env.PORT}",
            "JWT_SECRET=${env.JWT_SECRET}",
            "GOOGLE_CLIENT_ID=${env.GOOGLE_CLIENT_ID}",
            "GOOGLE_CLIENT_SECRET=${env.GOOGLE_CLIENT_SECRET}",
            "FACEBOOK_CLIENT_ID=${env.FACEBOOK_CLIENT_ID}",
            "FACEBOOK_CLIENT_SECRET=${env.FACEBOOK_CLIENT_SECRET}",
            "NODE_ENV=production"
          ]) {
            sh 'docker-compose up -d'
          }
        }
      }
    }

    stage('🧹 Docker Cleanup') {
      steps {
        sh '''
          docker image prune -af --filter "until=24h"
          docker builder prune -af || true
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Deploy สำเร็จเรียบร้อย 🎉'
    }
    failure {
      echo '❌ มีข้อผิดพลาด โปรดตรวจสอบ log ครับ'
    }
  }
}
