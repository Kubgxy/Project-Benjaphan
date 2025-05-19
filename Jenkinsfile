pipeline {
  agent any

  parameters {
    booleanParam(
      name: 'USE_NO_CACHE',
      defaultValue: false,
      description: 'เลือกว่าจะใช้ --no-cache หรือไม่'
    )
  }

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('🔄 Clean Workspace') {
      steps {
        deleteDir()
      }
    }

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
          if (params.USE_NO_CACHE) {
            sh 'docker-compose build --no-cache'
          } else {
            sh 'docker-compose build'
          }
        }
      }
    }

    stage('🚀 Docker Up') {
      steps {
        sh 'docker-compose up -d'
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
