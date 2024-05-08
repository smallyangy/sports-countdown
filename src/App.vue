<template>
    <van-config-provider theme="dark">
        <div class="page">
            <div class="current-time">
                <span>当前时间:</span>
                <span>{{ currentTime }}</span>
            </div>
            <div class="content-body">
                <div class="label-item">
                    <div class="label">运动时长：</div>
                    <div>
                        <van-radio-group
                            v-model="form.sportsTime"
                            direction="horizontal"
                        >
                            <van-radio name="1">1分钟</van-radio>
                            <van-radio name="2">2分钟</van-radio>
                            <van-radio name="3">3分钟</van-radio>
                            <van-radio name="4">4分钟</van-radio>
                            <!-- <van-radio name="5">5分钟</van-radio> -->
                        </van-radio-group>
                    </div>
                </div>
                <div class="label-item">
                    <div class="label">休息时长：</div>
                    <div>
                        <van-radio-group
                            v-model="form.restTime"
                            direction="horizontal"
                        >
                            <van-radio name="1">1分钟</van-radio>
                            <van-radio name="2">2分钟</van-radio>
                            <van-radio name="3">3分钟</van-radio>
                            <van-radio name="4">4分钟</van-radio>
                            <!-- <van-radio name="5">5分钟</van-radio> -->
                        </van-radio-group>
                    </div>
                </div>
                <div class="bottom-btns">
                    <!-- 开始按钮 -->
                    <van-button style="width: 100%;" plain>开始</van-button>
                    <van-button style="width: 100%; margin-top: 16px;" type="danger" plain>暂停</van-button>
                    <!-- 暂停按钮 -->
                </div>
            </div>
        </div>
    </van-config-provider>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { reactive } from 'vue';
import { onUnmounted } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useStorage } from '@vueuse/core';

const currentTime = ref(dayjs().format('HH:mm:ss'));

const timer = ref(null);

const form = useStorage(
    'countdown-form',
    reactive({
        sportsTime: '3',
        restTime: '2',
    })
);

// 注册定时器
const startInterval = () => {
    if (timer.value) return;
    timer.value = setInterval(() => {
        // 更新当前时间
        currentTime.value = dayjs().format('HH:mm:ss');
    }, 1000);
};

onMounted(() => {
    startInterval();
});
onUnmounted(() => {
    clearInterval(timer.value);
    timer.value = null;
});
</script>

<style lang="scss" scoped>
.page {
    --van-button-plain-background: transparent;
    padding: 32px;
    .current-time {
        font-size: 32px;
        padding: 16px 0;
        background: linear-gradient(to top, rgba(white, 0.2), rgba(white, 0.1));
        border: 1px solid rgba(white, 0.1);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        gap: 16px;
        span {
            flex: 1;
            &:nth-of-type(1) {
                text-align: right;
            }
        }
    }
    .content-body {
        padding-top: 32px;
    }
    .label-item {
        .label {
            padding-bottom: 20px;
        }
    }
    .label-item ~ .label-item {
        margin-top: 32px;
    }

    .bottom-btns {
      margin-top: 100px;
    }
}
</style>
