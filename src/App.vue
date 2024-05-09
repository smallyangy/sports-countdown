<template>
    <van-config-provider theme="dark">
        <div class="page">
            <div class="current-time">
                <span>当前时间:</span>
                <span>{{ currentTime }}</span>
            </div>
            <div class="content-body">
                <div class="content">
                    <div class="label-item">
                        <div class="label">运动时长：</div>
                        <div>
                            <van-radio-group
                                v-model="countdown.sportsTime"
                                direction="horizontal"
                            >
                                <van-radio :name="2">2分钟</van-radio>
                                <van-radio :name="3">3分钟</van-radio>
                                <van-radio :name="4">4分钟</van-radio>
                                <van-radio :name="5">5分钟</van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                    <div class="label-item">
                        <div class="label">休息时长：</div>
                        <div>
                            <van-radio-group
                                v-model="countdown.restTime"
                                direction="horizontal"
                            >
                                <van-radio :name="1">1分钟</van-radio>
                                <van-radio :name="2">2分钟</van-radio>
                                <van-radio :name="3">3分钟</van-radio>
                                <van-radio :name="4">4分钟</van-radio>
                                <!-- <van-radio name="5">5分钟</van-radio> -->
                            </van-radio-group>
                        </div>
                    </div>
                    <van-divider />
                    <!-- 进度条 -->
                    <div
                        v-if="startForm.sportsShow || startForm.durationShow"
                        class="sports-countdown"
                    >
                        <van-circle
                            v-if="startForm.sportsShow"
                            :current-rate="computedSportsCurrentPercentage"
                            :rate="100"
                            size="50vw"
                            :stroke-width="100"
                            color="#67C23A"
                        >
                            <div
                                style="
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100%;
                                "
                            >
                                <div>运动中</div>
                                <div>
                                    {{
                                        startForm.sportsTotal -
                                        startForm.sportsCurrent
                                    }}s
                                </div>
                            </div>
                        </van-circle>
                        <van-circle
                            v-if="startForm.durationShow"
                            :current-rate="computeddurationCurrentPercentage"
                            :rate="100"
                            size="50vw"
                            :stroke-width="100"
                            color="#F56C6C"
                        >
                            <div
                                style="
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100%;
                                "
                            >
                                <div>休息中</div>
                                <div>
                                    {{
                                        startForm.durationTotal -
                                        startForm.durationCurrent
                                    }}s
                                </div>
                            </div>
                        </van-circle>
                    </div>
                </div>
                <div class="bottom-btns">
                    <!-- 开始按钮 -->
                    <van-button style="width: 100%" plain @click="handleStart"
                        >开始</van-button
                    >
                    <van-button
                        style="width: 100%; margin-top: 16px"
                        type="danger"
                        plain
                        @click="handlePuase"
                        >{{ startForm.pause ? '继续' : '暂停' }}</van-button
                    >
                    <van-button
                        style="width: 100%; margin-top: 16px"
                        type="warning"
                        plain
                        @click="handleResetAll"
                        >数据归零</van-button
                    >
                    <!-- 暂停按钮 -->
                </div>
                <van-divider></van-divider>
                <!-- 统计 -->
                <div class="count-wrapper">
                  <van-notice-bar color="#67C23A" background="rgba(10,10,10, 1)">
                    运动轮次: {{ count.sportsCount }} ({{
                            duration.sportsDuration
                        }}分钟)
                  </van-notice-bar>
                  <van-notice-bar color="#F56C6C" background="rgba(10,10,10, 1)">
                        休息轮次: {{ count.restCount }} ({{
                            duration.restDuration
                        }}分钟)
                    </van-notice-bar>
                    <van-notice-bar color="#409EFF" background="rgba(10,10,10, 1)">总时长: {{ computedDuration }}分钟</van-notice-bar>
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
import { computed } from 'vue';

const currentTime = ref(dayjs().format('HH:mm:ss'));

const timer = ref(null);

// 时间设置
const countdown = useStorage(
    'countdown-form',
    reactive({
        sportsTime: 3,
        restTime: 2,
    })
);
// 次数统计
const count = useStorage(
    'count-form',
    reactive({
        sportsCount: 0,
        restCount: 0,
    })
);
// 时长统计
const duration = useStorage(
    'duration-form',
    reactive({
        sportsDuration: 0,
        restDuration: 0,
    })
);

const computedDuration = computed(() => {
    const { sportsDuration, restDuration } = duration.value;
    return sportsDuration + restDuration;
});

const startForm = reactive({
    sportsShow: false,
    sportsCurrent: 0,
    sportsTotal: 0,
    durationShow: false,
    durationCurrent: 0,
    durationTotal: 0,
    pause: false,
});

// 注册定时器
const startInterval = () => {
    if (timer.value) return;
    timer.value = setInterval(() => {
        // 更新当前时间
        currentTime.value = dayjs().format('HH:mm:ss');
        if (startForm.sportsShow && !startForm.pause) {
            startForm.sportsCurrent += 1;
            if (computedSportsCurrentPercentage.value > 100) {
                // 运动时间走完，做结算
                startForm.sportsShow = false;
                count.value.sportsCount += 1;
                duration.value.sportsDuration += countdown.value.sportsTime;
                // 播放运动结束音效
                handlePlaySound(1);
                // 进入休息时间循环
                handleShowRest();
            }
        }
        if (startForm.durationShow && !startForm.pause) {
            startForm.durationCurrent += 1;
            if (computeddurationCurrentPercentage.value > 100) {
                // 休息时间走完，做结算
                startForm.durationShow = false;
                count.value.restCount += 1;
                duration.value.restDuration += countdown.value.restTime;
                // 播放运动结束音效
                handlePlaySound(2);
                // 进入运动循环
                handleShowSports();
            }
        }
    }, 1000);
};

const createAudio = (src) => {
    const audio = document.createElement('audio');
    audio.src = src;
    return audio;
};
// 播放音效
const sound1 = createAudio('https://imgcdn.huanjutang.com/image/2024/05/09/e0862fe78340f1bfbc2d65789577c1b5.mp3');
const sound2 = createAudio('https://imgcdn.huanjutang.com/image/2024/05/09/951628d9940fa6059ac183ad65ec7947.mp3');
const handlePlaySound = (type) => {
  if (type === 1) sound1.play();
  if (type === 2) sound2.play();
}

const handleStart = () => {
    // 展示运动倒计时
    handleShowSports();
};

const handleShowSports = () => {
    if (startForm.sportsShow || startForm.durationShow) return;

    const { sportsTime } = countdown.value;
    startForm.sportsShow = true;
    startForm.sportsCurrent = 0;
    startForm.sportsTotal = sportsTime * 60;
};
const handleShowRest = () => {
    if (startForm.sportsShow || startForm.durationShow) return;

    const { restTime } = countdown.value;
    startForm.durationShow = true;
    startForm.durationCurrent = 0;
    startForm.durationTotal = restTime * 60;
};

const computedSportsCurrentPercentage = computed(() => {
    const { sportsCurrent, sportsTotal } = startForm;
    return Math.ceil((sportsCurrent / sportsTotal) * 100);
});
const computeddurationCurrentPercentage = computed(() => {
    const { durationCurrent, durationTotal } = startForm;
    return Math.ceil((durationCurrent / durationTotal) * 100);
});

// 数据归零
const handleResetAll = () => {
    count.value.sportsCount = 0;
    count.value.restCount = 0;
    duration.value.sportsDuration = 0;
    duration.value.restDuration = 0;
    startForm.sportsShow = false;
    startForm.sportsCurrent = 0;
    startForm.sportsTotal = 0;
    startForm.durationShow = false;
    startForm.durationCurrent = 0;
    startForm.durationTotal = 0;
    startForm.pause = false;
};

// 暂停/继续
const handlePuase = () => {
    if (startForm.sportsShow || startForm.durationShow) {
        startForm.pause = !startForm.pause;
    }
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
        padding-top: 100px;
    }
    .label-item {
        .label {
            padding-bottom: 20px;
        }
    }
    .label-item ~ .label-item {
        margin-top: 32px;
    }

    .count-wrapper {
        margin-top: 32px;
    }

    .bottom-btns {
        margin-top: 100px;
    }
    .content {
        position: relative;
    }
    .sports-countdown {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(black, 0.6);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        --van-circle-text-font-size: 80px;
    }
}
</style>
