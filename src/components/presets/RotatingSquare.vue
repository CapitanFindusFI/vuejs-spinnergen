<template>
    <div class="row align-items-center">
        <div class="col-8">
            <h4>Rotating Square</h4>
        </div>
        <div class="col-4">
            <div class="spinner rotating-square" :style="styleProperties"></div>
        </div>
    </div>
</template>

<script>
    import '../../assets/presets/rotating-square.css';

    const initialState = () => {
        return {
            cssPath: '/public/assets/presets/rotating-square.css'
        }
    };

    export default {
        name: "RotatingSquare",
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
        -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
        animation: sk-rotateplane 1.2s infinite ease-in-out;
    }

    @-webkit-keyframes sk-rotateplane {
        0% {
            -webkit-transform: perspective(120px)
        }
        50% {
            -webkit-transform: perspective(120px) rotateY(180deg)
        }
        100% {
            -webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg)
        }
    }

    @keyframes sk-rotateplane {
        0% {
            transform: perspective(120px) rotateX(0deg) rotateY(0deg);
            -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
        }
        50% {
            transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
            -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
        }
        100% {
            transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
            -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        }
    }
</style>
