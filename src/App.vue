<template>
    <div id="app">
        <header class="py-3 container-fluid">
            <div class="container">
                <h1>
                    <img src="./assets/logo.png" alt="Vue"/>
                    Image Spinner Generator
                </h1>
            </div>
        </header>
        <div id="wrapper" class="container-fluid">
            <div class="container h-100">
                <div class="row align-items-stretch h-100">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <aside id="presets">
                            <h4 class="title is-4">Choose a preset</h4>
                            <div class="row">
                                <div class="col-12"
                                     v-for="preset in loadedPresets"
                                     :key="preset.id"
                                     @click="setPreset(preset.name)">
                                    <component :is="preset.name" :styleProperties="presetDefaultStyle"></component>
                                </div>
                            </div>
                        </aside>
                    </div>
                    <div class="col-lg-8 col-md-6 col-sm-12">
                        <main id="preview text-center">
                            <h4 class="title is-4">Chosen preset</h4>
                            <div class="row">
                                <div class="col-12 text-center">
                                    <component ref="previewComponent"
                                               :is="dynamicComponent"
                                               :styleProperties="presetComponentStyle"></component>
                                </div>
                            </div>
                            <div id="crop-area" v-if="showCropArea">
                                <div class="row">
                                    <div class="col-12">
                                        <h4 class="subtitle is-4">Crop image</h4>
                                    </div>
                                    <div class="col-12">
                                        <div class="row align-items-center">
                                            <div class="col-lg-6 col-md-6 col-sm-12">
                                                <cropper v-model="cropperModel"></cropper>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-12">
                                                <button type="button" class="btn btn-primary btn-block"
                                                        @click="generateCrop()">
                                                    <i class="fas fa-save"></i> Save
                                                </button>
                                                <button type="button" class="btn btn-warning btn-block"
                                                        :class="{'is-loading' : isLoadingAssets, 'is-disabled' : !canExtractCss}"
                                                        :disabled="!canExtractCss"
                                                        v-if="!isLoadedAssets"
                                                        @click="extractAssets()">
                                                    <i class="fas fa-upload"></i> Extract CSS
                                                </button>
                                                <button type="button" class="btn btn-success btn-block"
                                                        v-if="loadedAssets.css"
                                                        @click="copyCSS()">
                                                    <i class="fas fa-sad-cry"></i> Copy CSS
                                                </button>
                                                <button type="button" class="btn btn-success btn-block"
                                                        v-if="loadedAssets.html"
                                                        @click="copyHTML()">
                                                    <i class="fas fa-sad-cry"></i> Copy HTML
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
        <footer class="py-2 container-fluid">
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

<style lang="scss">
    #app {
        height: 100vh;

        header {
            height: 80px;
        }

        footer {
            height: 60px;
        }

        #wrapper {
            height: calc(100vh - 140px);

            aside#presets {
                border-right: 1px solid #ccc;
                padding-right: 16px;

                .preset-item {
                    cursor: pointer;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #ccc;

                    .spinner {
                        width: 50px;
                        height: 50px;
                    }

                    h4 {
                        text-align: left;
                        margin: 0;
                    }
                }
            }

            main#preview {
                border-bottom: 1px solid #ccc;
                padding-bottom: 16px;

                .spinner {
                    width: 100px;
                    height: 100px;
                }
            }
        }
    }

    .spinner {
        margin: 0;
    }
</style>
