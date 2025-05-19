pipeline {
  agent any

  parameters {
    booleanParam(
      name: 'USE_NO_CACHE',
      defaultValue: false,
      description: 'เลือกว่าจะใช้ --no-cache หรือไม่ (Build ช้าหน่อยแต่สะอาด)'
    )
  }

  environment {
    PROJECT_DIR = "/root/Project-Benjaphan"
  }

  stages {
    stage('📥 Checkout') {
      steps {
        echo '✅ Jenkins จะ checkout จาก GitHub ให้โดยอัตโนมัติ'
      }
    }

    stage('♻️ Docker Down & Clean') {
      steps {
        dir("${env.PROJECT_DIR}") {
          echo '🧹 หยุด container เก่า (และลบ orphan)'
          sh 'docker compose down --remove-orphans || true'
        }
      }
    }

    stage('🐳 Docker Build') {
      steps {
        dir("${env.PROJECT_DIR}") {
          script {
            if (params.USE_NO_CACHE) {
              echo '🔥 Build ใหม่ทั้งหมด (--no-cache)'
              sh 'docker compose build --no-cache'
            } else {
              echo '⚡ Build ปกติ (ใช้ cache)'
              sh 'docker compose build'
            }
          }
        }
      }
    }

    stage('🚀 Deploy Compose') {
      steps {
        dir("${env.PROJECT_DIR}") {
          echo '🚀 รันระบบด้วย docker compose up'
          sh 'docker compose up -d'
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
