<template>
    <div id="app">
        <header class="section">
            <div class="container">
                <h1>
                    <img src="./assets/logo.png" alt="Vue"/>
                    Image Spinner Generator
                </h1>
            </div>
        </header>
        <div id="wrapper" class="section">
            <div class="container">
                <div class="columns">
                    <aside class="column is-one-third">
                        <div id="presets" class="columns is-multiline">
                            <div class="column is-full">
                                <h4 class="title is-4">
                                    Choose a preset
                                </h4>
                            </div>
                            <div class="column is-full preset-item"
                                 v-for="preset in loadedPresets"
                                 :key="preset.id"
                                 @click="setPreset(preset.name)">
                                <component :is="preset.name" :styleProperties="presetDefaultStyle"></component>
                            </div>
                        </div>
                    </aside>

                    <main class="column is-two-thirds">
                        <div id="preview" class="text-center">
                            <h4 class="title is-4">Chosen preset</h4>
                            <component ref="previewComponent" :is="dynamicComponent"
                                       :styleProperties="presetComponentStyle"></component>
                        </div>
                        <div id="crop-area" v-if="showCropArea">
                            <div class="columns is-multiline">
                                <div class="column is-full">
                                    <h4 class="subtitle is-4">Crop image</h4>
                                </div>
                                <div class="column is-half">
                                    <cropper v-model="cropperModel"></cropper>
                                </div>
                                <div class="column is-half">
                                    <button type="button" class="button is-primary is-fullwidth"
                                            @click="generateCrop()">
                                        <i class="fas fa-save"></i> Save
                                    </button>
                                    <button type="button" class="button is-warning is-fullwidth"
                                            :class="{'is-loading' : isLoadingAssets, 'is-disabled' : !canExtractCss}"
                                            :disabled="!canExtractCss"
                                            v-if="!isLoadedAssets"
                                            @click="extractAssets()">
                                        <i class="fas fa-upload"></i> Extract CSS
                                    </button>
                                    <button type="button" class="button is-success is-fullwidth"
                                            v-if="loadedAssets.css"
                                            @click="copyCSS()">
                                        <i class="fas fa-sad-cry"></i> Copy CSS
                                    </button>
                                    <button type="button" class="button is-success is-fullwidth"
                                            v-if="loadedAssets.html"
                                            @click="copyHTML()">
                                        <i class="fas fa-sad-cry"></i> Copy HTML
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        <footer class="section">
            <div class="container">
                <p>
                    Made with <i class="fas fa-heart"></i>
                    using <a href="https://github.com/CapitanFindusFI" target="_blank">Github</a>
                </p>
            </div>
        </footer>
    </div>
</template>

<script>
    /* eslint-disable no-console */

    import './assets/app.css';
    import 'bulma/css/bulma.css';
    import '@fortawesome/fontawesome-free/css/all.css';
    import 'vue-croppa/dist/vue-croppa.css';

    import RotatingSquare from './components/presets/RotatingSquare';
    import BouncingCircle from './components/presets/BouncingCircle';
    import OutputModal from "./components/modals/OutputModal";
    import Cropper from "vue-croppa/src/cropper";

    const defaultAssets = () => {
        return {
            css: null,
            html: null
        };
    };

    const defaultPresetStyle = () => {
        return {
            "background-size": "cover",
            "background-color": "#333"
        };
    };

    const initialState = () => {
        return {
            dynamicComponent: null,
            presetDefaultStyle: defaultPresetStyle(),
            presetComponentStyle: null,
            showCropArea: false,
            canExtractCss: false,
            cropperModel: null,
            loadedPresets: [],
            isLoadingAssets: false,
            isLoadedAssets: false,
            loadedAssets: defaultAssets()
        }
    };

    export default {
        name: 'app',
        components: {
            Cropper,
            'rotating-square': RotatingSquare,
            'bouncing-circle': BouncingCircle,
            'modal-output': OutputModal
        },
        data() {
            return initialState();
        },
        methods: {
            setPreset(componentName) {
                this.dynamicComponent = componentName;
                this.presetComponentStyle = this.presetDefaultStyle;
                this.showCropArea = true;

                this.canExtractCss = false;
                this.presetComponentStyle = defaultPresetStyle();
                this.loadedAssets = defaultAssets();
                this.isLoadedAssets = false;
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
            extractAssets() {
                this.isLoadingAssets = true;

                const dynamicComponent = this.$refs['previewComponent'];

                Promise.all([
                    this.extractCSS(dynamicComponent.cssPath),
                    this.extractHTML(dynamicComponent.htmlPath)
                ]).then(response => {
                    console.log(response);

                    this.loadedAssets.css = response[0];
                    this.loadedAssets.html = response[1];

                    this.isLoadingAssets = false;
                    this.isLoadedAssets = true;
                });
            },
            extractCSS(cssPath) {
                return fetch(cssPath).then(response => {
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
                });
            },
            extractHTML(htmlPath) {
                return fetch(htmlPath).then(response => {
                    return response.text();
                });
            },
            copyCSS() {
                navigator.clipboard.writeText(this.loadedAssets.css).then(() => {
                    this.$toasted.show("CSS copied to clipboard", {
                        theme: "toasted-primary",
                        position: "top-center",
                        duration: 3000
                    });
                });
            },
            copyHTML() {
                navigator.clipboard.writeText(this.loadedAssets.html).then(() => {
                    this.$toasted.show("HTML copied to clipboard", {
                        theme: "toasted-primary",
                        position: "top-center",
                        duration: 3000
                    });
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
