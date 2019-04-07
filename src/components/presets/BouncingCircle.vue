<template>
    <div class="columns is-vcentered">
        <div class="column is-two-thirds">
            <h5 class="subtitle is-5">Bouncing Circle</h5>
        </div>
        <div class="column is-one-third">
            <div class="spinner bouncing-circle">
                <div class="double-bounce1" :style="styleProperties"></div>
                <div class="double-bounce2" :style="styleProperties"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../../assets/presets/bouncing-circle.css';

    const initialState = () => {
        return {
            cssPath: '/assets/presets/bouncing-circle/style.css',
            htmlPath: '/assets/presets/bouncing-circle/template.html'
        }
    };

    export default {
        name: "BouncingCircle",
        data() {
            return initialState();
        },
        props: [
            'styleProperties'
        ],
        methods: {}
    }
</script>

<style scoped>
    .spinner {
        position: relative;
    }

    .double-bounce1, .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;
        background-size: cover;

        -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
        animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    @-webkit-keyframes sk-bounce {
        0%, 100% {
            -webkit-transform: scale(0.0)
        }
        50% {
            -webkit-transform: scale(1.0)
        }
    }

    @keyframes sk-bounce {
        0%, 100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        }
        50% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
        }
    }
</style>
