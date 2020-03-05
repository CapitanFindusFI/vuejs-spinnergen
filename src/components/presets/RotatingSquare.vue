<template>
    <div class="row align-items-center">
        <div class="col-lg-8 col-md-6 col-sm-12">
            <h5 class="subtitle is-5">Rotating Square</h5>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="spinner rotating-square" :style="styleProperties"></div>
        </div>
    </div>
</template>

<script>
    import '../../assets/presets/rotating-square.css';

    const initialState = () => {
        return {
            cssPath: '/assets/presets/rotating-square/style.css',
            htmlPath: '/assets/presets/rotating-square/template.html',
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
