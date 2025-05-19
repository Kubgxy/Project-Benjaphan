pipeline {
  agent any

  parameters {
    booleanParam(
      name: 'USE_NO_CACHE',
      defaultValue: false,
      description: 'เลือกว่าจะใช้ --no-cache หรือไม่ (Build ช้าหน่อยแต่สะอาด)'
    )
  }

  stages {
    stage('🔄 Clean Workspace') {
      steps {
        deleteDir() // ล้าง workspace เดิมก่อน pull ใหม่
      }
    }

    stage('📥 Checkout Source Code') {
      steps {
        checkout scm // ดึงจาก GitHub ตามที่ config SCM ไว้
      }
    }

    stage('♻️ Docker Down & Clean') {
      steps {
        echo '🧹 หยุด container เก่า (และลบ orphan)'
        sh 'docker-compose down --remove-orphans || true'
      }
    }

    stage('🐳 Docker Build') {
      steps {
        script {
          if (params.USE_NO_CACHE) {
            echo '🔥 Build ใหม่ทั้งหมด (--no-cache)'
            sh 'docker-compose build --no-cache'
          } else {
            echo '⚡ Build ปกติ (ใช้ cache)'
            sh 'docker-compose build'
          }
        }
      }
    }

    stage('🚀 Deploy Compose') {
      steps {
        echo '🚀 รันระบบด้วย docker-compose up'
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
