<template>
    <div id="app">
        <modals-container/>
        <header class="container-fluid">
            <div class="container">
                <h1>
                    <img src="./assets/logo.png" alt="Vue"/>
                    Image Spinner Generator
                </h1>
            </div>
        </header>
        <div id="wrapper" class="container-fluid">
            <div class="container">
                <div class="row">
                    <aside class="col-lg-4 col-md-6 col-sm-12">
                        <div id="presets" class="row">
                            <h2 class="col-12 text-center mb-5">
                                Choose a preset
                            </h2>
                            <div class="col-12 preset-item"
                                 v-for="preset in loadedPresets"
                                 :key="preset.id"
                                 @click="setPreset(preset.name)">
                                <component :is="preset.name" :styleProperties="presetDefaultStyle"></component>
                            </div>
                        </div>
                    </aside>

                    <main class="col-lg-8 col-md-6 col-sm-12">
                        <div id="preview" class="text-center">
                            <h2 class="col-12 text-center mb-5">Chosen preset</h2>
                            <component ref="previewComponent" :is="dynamicComponent"
                                       :styleProperties="presetComponentStyle"></component>
                        </div>
                        <div id="crop-area" v-if="showCropArea">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-12">
                                    <h2 class="text-center mb-5">Crop image</h2>
                                    <cropper v-model="cropperModel"></cropper>
                                    <button type="button" class="btn-block btn-primary"
                                            @click="generateCrop()">
                                        <i class="fas fa-save"></i> Save
                                    </button>
                                    <button type="button" class="btn-block btn-primary"
                                            :disabled="!canExtractCss"
                                            @click="extractCss()">
                                        <i class="fas fa-upload"></i> Extract CSS
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12">

                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
        <footer>

        </footer>
    </div>
</template>

<script>
    /* eslint-disable no-console */

    import './assets/app.css';
    import 'bootstrap/dist/css/bootstrap.css';
    import 'vue-croppa/dist/vue-croppa.css'

    import RotatingSquare from './components/presets/RotatingSquare';
    import BouncingCircle from './components/presets/BouncingCircle';
    import Cropper from "vue-croppa/src/cropper";

    const initialState = () => {
        return {
            dynamicComponent: null,
            presetDefaultStyle: {
                "background-size": "cover",
                "background-color": "#333"
            },
            presetComponentStyle: null,
            showCropArea: false,
            canExtractCss: false,
            cropperModel: null,
            loadedPresets: [],
            windowPresets: window.spinnerPresets
        }
    };

    export default {
        name: 'app',
        components: {
            Cropper,
            'rotating-square': RotatingSquare,
            'bouncing-circle': BouncingCircle
        },
        data() {
            return initialState();
        },
        methods: {
            setPreset(componentName) {
                this.dynamicComponent = componentName;
                this.presetComponentStyle = this.presetDefaultStyle;
                this.showCropArea = true;
            },
            generateCrop() {
                const dataURL = this.cropperModel.generateDataUrl('image/jpeg', 0.8);
                this.canExtractCss = !!dataURL;
                if (dataURL) {
                    this.presetComponentStyle = {
                        "background-image": `url(${dataURL})`,
                        "background-size": "cover"
                    };
                }
            },
            extractCss() {
                fetch(this.windowPresets[this.dynamicComponent]).then(response => {
                    return response.text();
                }).then(css => {
                    const replaceWith = Object.keys(this.presetComponentStyle).map(key => {
                        return [
                            key,
                            `${this.presetComponentStyle[key]};`
                        ].join(":");
                    }).reduce((a, b) => {
                        return a.concat(b);
                    }, []).join("\n");

                    const placeholderString = "/*placeholder*/";
                    if (css.indexOf(placeholderString) === -1) {
                        // wtf
                    }

                    return css.split(placeholderString).join(replaceWith);
                }).then(finalCss => {
                    console.log(finalCss);
                });
            }
        },
        mounted() {
            this.loadedPresets = [
                'rotating-square',
                'bouncing-circle'
            ].map((preset, index) => {
                return {
                    id: index,
                    name: preset
                };
            });
        }
    }
</script>

<style>
    #app {
    }

    .spinner {
        margin: 0;
    }

    #wrapper {

    }

    #wrapper aside {
        border-right: 1px solid #ccc;
    }

    #wrapper aside #presets {
        padding-right: 16px;
    }

    #wrapper aside #presets .preset-item {
        cursor: pointer;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #ccc;
    }

    #wrapper aside #presets .preset-item .spinner {
        width: 50px;
        height: 50px;
    }

    #wrapper aside #presets .preset-item h4 {
        text-align: left;
        margin: 0;
    }

    #wrapper main #preview {
        border-bottom: 1px solid #ccc;
        padding-bottom: 16px;
    }

    #wrapper main #preview .spinner {
        width: 100px;
        height: 100px;
    }


</style>
