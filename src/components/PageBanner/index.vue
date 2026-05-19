<template>
  <div class="page-banner" :class="{ 'page-banner--has-tabs': $slots.tabs }">
    <div class="page-banner__left">
      <div class="page-banner__text">
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot name="tabs" />
    </div>
    <img v-if="decoImage" class="page-banner__deco" :src="decoImage" alt="" />
  </div>
</template>

<script>
export default {
  name: 'PageBanner',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    decoImage: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  computed: {
    bannerStyle() {
      if (this.bgImage) {
        return {
          backgroundImage: `url('${this.bgImage}'), linear-gradient(135deg, #1a3a4a 0%, #234b5a 40%, #1d6b6b 100%)`
        }
      }
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
.page-banner {
  flex-shrink: 0;
  height: 140px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1a3a4a 0%, #234b5a 40%, #1d6b6b 100%);
  background-image: url('~@/assets/images/top_bg.png'), linear-gradient(135deg, #1a3a4a 0%, #234b5a 40%, #1d6b6b 100%);
  background-repeat: no-repeat;
  background-position: center center, center;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;

  &--has-tabs {
    height: auto;
    min-height: 140px;
    align-items: flex-start;
    padding: 24px 40px;
  }

  &__left {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
  }

  &__text {
    h2 {
      margin: 0 0 6px;
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }

    p {
      margin: 0;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &__deco {
    position: relative;
    z-index: 2;
    width: 120px;
    object-fit: contain;
  }
}
</style>
