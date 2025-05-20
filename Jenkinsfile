pipeline {
  agent {
    label 'master' // หรือ node ที่น้องใช้
    customWorkspace '/opt/jenkins_workspace/Benjaphan-Deploy'
  }

  options {
    skipDefaultCheckout()
  }

  parameters {
    booleanParam(
      name: 'USE_NO_CACHE',
      defaultValue: false,
      description: 'เลือกว่าจะใช้ --no-cache หรือไม่'
    )
  }

  stages {
    stage('📥 Checkout Source Code') {
      steps {
        checkout scm
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
        sh 'docker-compose down --remove-orphans || true'
      }
    }

    stage('🐳 Docker Build') {
      steps {
        script {
          def buildCmd = params.USE_NO_CACHE ? 'docker-compose build --no-cache' : 'docker-compose build'
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
            sh buildCmd
          }
        }
      }
    }

    stage('🚀 Docker Up') {
      steps {
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

    stage('🧹 Docker Cleanup') {
      steps {
        echo '🧼 Cleaning old Docker builder cache...'
        sh 'docker builder prune -af || true'
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
