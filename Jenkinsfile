pipeline {
  agent any

  parameters {
    booleanParam(
      name: 'USE_NO_CACHE',
      defaultValue: false,
      description: 'เลือกว่าจะใช้ --no-cache หรือไม่'
    )
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

    stage('🧪 Check nginx.conf & cert') {
      steps {
        sh '''
          echo "📄 nginx.conf:"
          ls -l nginx/nginx.conf || echo "❌ nginx.conf not found"

          echo "📁 cert folder tree:"
          ls -lhR nginx/cert || echo "❌ cert folder not found
        '''
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
          def composeCmd = params.USE_NO_CACHE ? 'docker-compose build --no-cache' : 'docker-compose build'
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
