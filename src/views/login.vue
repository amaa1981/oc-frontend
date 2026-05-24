<template>
  <div class="login-page">
    <!-- Particle background -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    
    <!-- Centered header logo -->
    <div class="login-header">
      <div class="login-header__logo">
        <img :src="logoSrc" alt="logo" />
      </div>
    </div>
    
    <!-- Main content - centered form -->
    <div class="login-content">
      <div class="login-card">
        <!-- Form header -->
        <div class="login-card__header">
          <div class="login-card__icon-wrap">
            <div class="login-card__icon-inner">
              <svg-icon icon-class="user" class="login-card__user-icon" />
            </div>
          </div>
          <div class="login-card__desc">
            <h2 class="login-card__title">{{ $t('login.title') }}</h2>
            <p class="login-card__subtitle">{{ $t('login.subtitle') }}</p>
          </div>
        </div>

        <!-- Form -->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-card__form"
        >
          <el-form-item prop="username">
            <label class="login-label">
              {{ $t('login.username') }}<span class="login-label__required">*</span>
            </label>
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              :placeholder="$t('login.usernamePlaceholder')"
              class="login-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <label class="login-label">
              {{ $t('login.password') }}<span class="login-label__required">*</span>
            </label>
            <el-input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              auto-complete="off"
              :placeholder="$t('login.passwordPlaceholder')"
              class="login-input"
              @keyup.enter.native="handleLogin"
            >
              <i
                slot="suffix"
                :class="showPassword ? 'el-icon-view' : 'el-icon-view'"
                class="login-input__eye"
                @click="showPassword = !showPassword"
              />
            </el-input>
          </el-form-item>

          <el-form-item prop="code" v-if="captchaEnabled">
            <label class="login-label">
              {{ $t('login.code') }}<span class="login-label__required">*</span>
            </label>
            <div class="login-captcha">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                :placeholder="$t('login.codePlaceholder')"
                class="login-input login-captcha__input"
                @keyup.enter.native="handleLogin"
              />
              <img :src="codeUrl" @click="getCode" class="login-captcha__img" />
            </div>
          </el-form-item>

          <div class="login-options">
            <el-checkbox v-model="loginForm.rememberMe" class="login-options__remember">
              {{ $t('login.rememberMe') }}
            </el-checkbox>
          </div>

          <el-form-item>
            <el-button
              :loading="loading"
              class="login-btn"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">{{ $t('login.logIn') }}</span>
              <span v-else>{{ $t('login.logIn') }}...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Footer copyright -->
      <div class="login-footer">
        <span>© 2026 . All right reserved.</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import settings from '@/settings'
import logoImg from '@/assets/images/logo.png'
import logo2Img from '@/assets/images/logo2.png'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      showPassword: false,
      logoSrc: settings.edition === 'standard' ? logo2Img : logoImg,
      canvas: null,
      ctx: null,
      particles: [],
      mouse: { x: null, y: null, radius: 150 },
      animationFrame: null,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: this.$t('commonTips.cannotBeEmpty') }],
        password: [{ required: true, trigger: 'blur', message: this.$t('commonTips.cannotBeEmpty') }],
        code: [{ required: false, trigger: 'change', message: this.$t('commonTips.cannotBeEmpty') }]
      },
      loading: false,
      captchaEnabled: false,
      register: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  mounted() {
    this.initParticles()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // Initialize particle system
    initParticles() {
      const canvas = this.$refs.particleCanvas
      if (!canvas) return

      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      this.particles = []
      this.mouse = { x: null, y: null, radius: 150 }

      this.handleResize()
      this.createParticles()
      this.animate()

      // Mouse move handler
      canvas.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x
        this.mouse.y = e.y
      })

      canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null
        this.mouse.y = null
      })
    },
    // Handle window resize
    handleResize() {
      if (!this.canvas) return
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.createParticles()
    },
    // Create particles
    createParticles() {
      this.particles = []
      const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000)
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * this.canvas.width
        const y = Math.random() * this.canvas.height
        const size = Math.random() * 3 + 1
        const speedX = (Math.random() - 0.5) * 0.5
        const speedY = (Math.random() - 0.5) * 0.5
        
        this.particles.push({ x, y, size, speedX, speedY, originalX: x, originalY: y })
      }
    },
    // Animation loop
    animate() {
      if (!this.ctx || !this.canvas) return

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      // Update and draw particles
      this.particles.forEach((particle, index) => {
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1

        // Mouse interaction
        if (this.mouse.x && this.mouse.y) {
          const dx = this.mouse.x - particle.x
          const dy = this.mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < this.mouse.radius) {
            const force = (this.mouse.radius - distance) / this.mouse.radius
            const angle = Math.atan2(dy, dx)
            particle.x -= Math.cos(angle) * force * 3
            particle.y -= Math.sin(angle) * force * 3
          }
        }

        // Draw particles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        this.ctx.shadowBlur = 3
        this.ctx.shadowColor = 'rgba(41, 144, 141, 0.8)'
        this.ctx.beginPath()
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.shadowBlur = 0

        // Draw connections
        for (let j = index + 1; j < this.particles.length; j++) {
          const dx = this.particles[j].x - particle.x
          const dy = this.particles[j].y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.4
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            this.ctx.lineWidth = 1
            this.ctx.beginPath()
            this.ctx.moveTo(particle.x, particle.y)
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
            this.ctx.stroke()
          }
        }
      })

      this.animationFrame = requestAnimationFrame(this.animate)
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? false : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.$router.push({ path: '/data' }).catch(() => {})
          }).catch(() => {
            this.loading = false
            if (this.captchaEnabled) {
              this.getCode()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// Full-page split layout
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background: url('~@/assets/images/new_bg.png') center center / cover no-repeat;
  padding: 10px;
  position: relative;
}

// Particle backgroundCanvas
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
}

// ==================== Header logo section ====================
.login-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 20px;
  z-index: 10;
  position: relative;

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 60px;
      object-fit: contain;
    }
  }
}

// Main content
.login-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 20px;
  z-index: 10;
  position: relative;
}

// Login card
.login-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(41, 144, 141, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   height: 3px;
  //   background: linear-gradient(90deg, #29908d, #01bba9, #29908d);
  //   background-size: 200% 100%;
  //   animation: shimmer 3s linear infinite;
  // }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  &__icon-wrap {
    padding: 12px;
    border-radius: 50%;
    border: 1px solid #e0f0ed;
    background: linear-gradient(180deg, rgba(231, 245, 242, 0.48) 0%, rgba(231, 245, 242, 0) 100%);
  }

  &__icon-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #b6dfd6;
    background: #fff;
  }

  &__user-icon {
    font-size: 20px;
    color: #29908d;
  }

  &__desc {
    text-align: center;
  }

  &__title {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 700;
    color: #0d0d12;
    line-height: 1.3;
  }

  &__subtitle {
    margin: 0;
    font-size: 13px;
    color: #666d80;
    line-height: 1.5;
  }

  &__form {
    display: flex;
    flex-direction: column;

    .el-form-item {
      margin-bottom: 14px;
    }

    // Validation error — red border and pink background
    ::v-deep .el-form-item.is-error .el-input__inner {
      border-color: #e8657d;
      background: #fff0f3;
    }
  }
}

// Label
.login-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666d80;
  line-height: 1.5;

  &__required {
    color: #df1c41;
    margin-left: 2px;
  }
}

// Input
.login-input {
  ::v-deep .el-input__inner {
    height: 48px;
    border-radius: 9999px;
    border: 1px solid #dfe1e7;
    background: #f9fafb;
    font-size: 15px;
    color: #0d0d12;
    padding: 0 16px;

    &::placeholder {
      color: #818898;
    }

    &:focus {
      border-color: #29908d;
      background: #fff;
    }
  }



  &__eye {
    cursor: pointer;
    color: #818898;
    font-size: 18px;
    line-height: 48px;
    padding-right: 4px;

    &:hover {
      color: #29908d;
    }
  }
}

// Captcha
.login-captcha {
  display: flex;
  gap: 12px;
  align-items: center;

  &__input {
    flex: 1;
  }

  &__img {
    height: 48px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid #dfe1e7;
  }
}

// Login Options row
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  margin-bottom: 32px;

  &__remember {
    ::v-deep .el-checkbox__label {
      font-size: 14px;
      color: #666d80;
    }

    ::v-deep .el-checkbox__inner {
      border-radius: 6px;
      border-color: #dfe1e7;
    }

    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #29908d;
      border-color: #29908d;
    }
  }
}

// Login button
.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(90deg, rgba(1, 187, 170, 0.5) 0%, rgba(1, 160, 189, 0.5) 100%),
    linear-gradient(270deg, #0f6a71 0%, #29908d 100%);
  box-shadow: 0 0 0 1px #156475;
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.32px;
  transition: opacity 0.2s;
margin-top: 20px;
  &:hover,
  &:focus {
    opacity: 0.88;
    color: #fff;
    background: linear-gradient(90deg, rgba(1, 187, 170, 0.6) 0%, rgba(1, 160, 189, 0.6) 100%),
      linear-gradient(270deg, #0f6a71 0%, #29908d 100%);
  }

  &.is-loading {
    opacity: 0.7;
  }
}

// Footer copyright
.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 10;
  position: relative;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
