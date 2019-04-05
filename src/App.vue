<template>
    <div id="app" class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div id="presets" class="row">
                        <h2 class="col-12 text-center mb-5">
                            Choose a preset
                        </h2>
                        <div class="col-12">
                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-12 preset-item"
                                     @click="setPreset('rotating-square')">
                                    <rotating-square></rotating-square>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div id="preview" class="row">
                        <h2 class="col-12 text-center mb-5">Chosen preset</h2>
                        <component :is="dynamicComponent"></component>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12" v-if="showCropArea">
                    <div class="col-12 text-center">
                        <h2>Crop image</h2>
                        <cropper></cropper>
                        <button type="button" class="btn-block btn-primary">
                            <i class="fas fa-save"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console */

    import 'bootstrap/dist/css/bootstrap.css';
    import 'vue-croppa/dist/vue-croppa.css'

    import RotatingSquare from './components/spinners/RotatingSquare';
    import Cropper from "vue-croppa/src/cropper";

    const initialState = () => {
        return {
            dynamicComponent: null,
            backgroundImageData: null,
            showCropArea: false
        }
    };

    export default {
        name: 'app',
        components: {
            Cropper,
            'rotating-square': RotatingSquare
        },
        data() {
            return initialState();
        },
        methods: {
            setPreset(componentName) {
                this.dynamicComponent = componentName;
                this.showCropArea = true;
                console.log(this.dynamicComponent);
            }
        },
        mounted() {
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .preset-item {
        cursor: pointer;
    }
</style>
